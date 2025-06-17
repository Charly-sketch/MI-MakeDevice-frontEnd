import { FabricationSettings } from "../pf_editor/FabricationSettingsModal";

/**
 * Sends fabrication settings to the server
 * @param settings The fabrication settings to send
 * @returns A promise that resolves to the response from the server
 */
export async function sendFabricationData(
  settings: FabricationSettings,
): Promise<any> {
  try {
    const response = await fetch("http://localhost:3333/run", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(settings), // Send as a JSON string
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error sending fabrication settings:", error);
    throw error;
  }
}

/**
 * Decodes a base64 encoded zip file and triggers download
 * @param fileInfo Object containing filename and base64 encoded zip data
 * @returns A promise that resolves to the decoded Blob
 */
export async function decodeAndDownloadZip(fileInfo: {
  filename: string;
  zipData: string;
}): Promise<Blob> {
  try {
    console.log("fileInfo", fileInfo);
    // Remove data URL prefix if it exists
    const base64Data = fileInfo.zipData.includes(";base64,")
      ? fileInfo.zipData.split(";base64,")[1]
      : fileInfo.zipData;

    let zipBlob: Blob;

    // For browser environments
    if (typeof window !== "undefined") {
      const binaryString = window.atob(base64Data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      zipBlob = new Blob([bytes], { type: "application/zip" });

      // Create download link and trigger download
      const downloadLink = document.createElement("a");
      downloadLink.href = URL.createObjectURL(zipBlob);
      downloadLink.download = fileInfo.filename;
      downloadLink.click();
      URL.revokeObjectURL(downloadLink.href);
    }
    // For Node.js environments
    else {
      const buffer = Buffer.from(base64Data, "base64");
      zipBlob = new Blob([buffer], { type: "application/zip" });
      // Note: In Node.js, you'd typically save to filesystem instead
    }

    return zipBlob;
  } catch (error) {
    console.error("Error decoding and downloading zip:", error);
    throw error;
  }
}

/**
 * Receives a zip file and report from the server
 * @param requestId The ID of the fabrication request
 * @returns A promise that resolves to an object containing the zip file and report
 */
export async function receiveFabricationResults(): Promise<{
  zipFile: Blob;
}> {
  try {
    // Use the correct port (3333) and the direct file download endpoint
    const response = await fetch(`http://localhost:3333/get_output`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // The response is the file itself, not JSON
    const zipFile = await response.blob();

    return {
      zipFile,
    };
  } catch (error) {
    console.error("Error receiving fabrication results:", error);
    throw error;
  }
}
