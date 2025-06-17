import React from "react";
import Dropzone from "react-dropzone";

const ModelDropzone = (props: {}) => {
  const onDrop = (acceptedFiles) => {
    console.log("dropped");
    console.log(acceptedFiles);
  };

  return (
    <>
      <div>
        <div>
          <Dropzone onDrop={onDrop}>
            {({ getRootProps, getInputProps }) => (
              <section>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100vh",
                  }}
                  {...getRootProps()}
                >
                  <input {...getInputProps()} />
                  <p>Drag drop some files here, or click to select files</p>
                </div>
              </section>
            )}
          </Dropzone>
        </div>
      </div>
    </>
  );
};

export default ModelDropzone;
