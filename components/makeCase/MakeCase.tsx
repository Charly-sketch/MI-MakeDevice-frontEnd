"use client";

import React, { useState, useEffect } from "react";

// import './makeCase.css';    
import * as THREE from "three";

import { makeCase } from './components/utils_makeCase';
import { Scene } from './components/scene';
import { handleJsonUpload } from './components/utils_json';
import {
  stlUpload,
  stlToggle,
  exportCaseAsStl,
  exportLidAsStl,
  stlScaleSave,
  stlMove,
  stlScale,
  stlAddNew,
  stlDeleteSelected
} from './components/utils_stl';


const MakeCase = (props: { isHidden: boolean }) => {
  const { isHidden } = props;
  const [jsonData, setJsonData] = useState(null);
  const [models, setModels] = useState([]);
  const [selectedModelIndex, setSelectedModelIndex] = useState(null);
  const [selectedStlIndex, setSelectedStlIndex] = useState(null);

  // Consts ?
  const pcbThick = 2;
  const mountingDepth = 4;

  const [progress, setProgress] = useState(0);
  const [lidMesh, setLidMesh] = useState(null);
  const [caseMesh, setCaseMesh] = useState(null);
  const [showCaseParams, setShowCaseParams] = useState(false);
  const [caseParams, setCaseParams] = useState({
    x: 0,
    y: 0,
    xOrigin: 0,
    yOrigin: 0,
    zOrigin: 0,
    screwHeight: 7,       // In mm, length of the head of the screw. ¬¬##
    xWallThickness: 7,
    yWallThickness: 7,
    zWallThickness: 7,
    roundness: 5,       // 0 makes it square.
    mountOptions: 0,
    batchSize:7      // 0: default, 1: flipped, 2: extra screw for height
  });

  const [levels, setLevels] = useState(1);
  const levelGap = (pcbThick + caseParams.screwHeight);  

  // Grabs stuff from Json.
  useEffect(() => {
    if (jsonData?.board?.origin && jsonData?.board?.size) {
      setCaseParams((prev) => ({
        ...prev,
        xOrigin: jsonData.board.origin.x ?? prev.xOrigin,
        yOrigin: jsonData.board.origin.y ?? prev.yOrigin,
        x: jsonData.board.size.x ?? prev.x,
        y: jsonData.board.size.y ?? prev.y,
      }));
    }
  }, [jsonData]);

  // This should be used for all Vars, it'd be nice but not required.
  const handleOptionChange = (key, value) => {
    setCaseParams(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Move updateAxis to top-level in App
  const updateAxis = (stlIdx, axis) => {
    setModels(prevModels => {
      const updated = prevModels.map((mod, idx) => {
        if (idx !== selectedModelIndex) return mod;
        const stlUrls = mod.stlUrls.map((meta, i) =>
          i === stlIdx ? { ...meta, axis } : meta
        );
        return { ...mod, stlUrls };
      });
      return updated;
    });
  };

  // I am not good at making UIs. :(
  return (
    <div hidden={isHidden}>
    <div className='App'>
      <div className="buttons-container">
        <input
          className="button-style"
          type="file"
          accept=".json"
          onChange={(e) => handleJsonUpload(e, setJsonData, setLevels, setModels, levelGap, setProgress, setCaseMesh, setLidMesh)}
        />

        <div className="button-group">
          <button
            onClick={() => makeCase(jsonData, caseParams, setProgress, levels, levelGap, mountingDepth, models, setLidMesh, setCaseMesh)}
            className="button-style button-blue"
          >
            Make Case
          </button>

          <button
            onClick={() => exportCaseAsStl(caseMesh)}
            className="button-style button-green"
            // style={{ position: "absolute", top: 40, left: 110, zIndex: 10 }}
          >
            Export Case
          </button>

          <button
            onClick={() => exportLidAsStl(lidMesh)}
            className="button-style button-green"
          >
            Export Lid
          </button>
        </div>

        <div className="model-selector">
          <select
            value={selectedModelIndex ?? ""}
            onChange={(e) =>
              setSelectedModelIndex(e.target.value === "" ? null : Number(e.target.value))
            }
            className='select-style'
          >
            <option value="">No Module Selected</option>
            {models.map((mod, idx) => (
              <option key={idx} value={idx}>
                {mod.model_name}
              </option>
            ))}
          </select>

          {/* Bouton pour sélectionner/désélectionner tous les STL du module sélectionné */}
          {selectedModelIndex !== null && (
            <button
              className="button-style button-select-all"
              onClick={() => {
                setModels(prevModels => prevModels.map((mod, idx) => {
                  if (idx !== selectedModelIndex) return mod;
                  const allVisible = mod.stlUrls.every((stl) => stl.visible);
                  const stlUrls = mod.stlUrls.map(stl => ({ ...stl, visible: !allVisible }));
                  return { ...mod, stlUrls };
                }));
              }}
            >
              {models[selectedModelIndex].stlUrls.every((stl) => stl.visible)
                ? "Deselect all"
                : "Select all"}
            </button>
          )}

          {selectedModelIndex !== null &&
            models[selectedModelIndex].stlUrls.map((stl, idx) => (
              <div key={idx} style={{ marginBottom: 10 }}>
                <label>
                  <input
                    type="checkbox"
                    checked={stl.visible}
                    onChange={() => stlToggle(idx, selectedModelIndex, setModels)}
                  />
                  {stl.model_name}
                </label>

                <button
                  onClick={() => setSelectedStlIndex(idx)}
                  className='button-style button-edit'
                >
                  Edit
                </button>

                {selectedStlIndex === idx && (
                  <div style={{ marginLeft: 10, marginTop: 6 }}>
                    <div style={{ position: "relative", display: "inline-block", zIndex: 10 }}>
                      <input
                        type="file"
                        accept=".stl"
                        onChange={(e) => stlUpload(e, idx)}
                        className='button-style input-file'
                      />
                      <button type="button" className="button-style">
                        Replace model
                      </button>
                    </div>
                    <div>
                      Axis:
                      <select
                        value={stl.axis}
                        onChange={(e) => updateAxis(idx, e.target.value)}
                        style={{ marginLeft: 5, marginBottom: 8, display: "block" }}
                      >
                        <option value="x">X</option>
                        <option value="y">Y</option>
                        <option value="z">Z</option>
                      </select>
                    </div>

                    <div>
                      Move:
                      <input
                        type="number"
                        value={stl.moveAmount}
                        onChange={(e) => stlMove(idx, parseFloat(e.target.value, setModels, selectedModelIndex))}
                        style={{ width: 60, marginLeft: 5 }}
                      />
                      <button
                        onClick={() => {
                          const updated = [...models];
                          const mod = updated[selectedModelIndex];
                          const geometry = mod._loadedStls[idx].clone();

                          const axis = mod.stlUrls[idx].axis || "x";
                          const moveAmount = mod.stlUrls[idx].moveAmount || 0;

                          const translation = new THREE.Vector3(
                            axis === "x" ? moveAmount : 0,
                            axis === "y" ? moveAmount : 0,
                            axis === "z" ? moveAmount : 0
                          );

                          geometry.translate(translation.x, translation.y, translation.z);

                          mod._loadedStls[idx] = geometry;

                          const pos = mod.stlUrls[idx].position || { x: 0, y: 0, z: 0 };
                          mod.stlUrls[idx].position = {
                            x: pos.x + translation.x,
                            y: pos.y + translation.y,
                            z: pos.z + translation.z,
                          };

                          setModels(updated);
                        }}
                        style={{ marginLeft: 5 }}
                      >
                        Apply Move
                      </button>
                    </div>

                    <div style={{ marginTop: 4 }}>
                      Scale:
                      <input
                        type="number"
                        value={stl.scaleFactor}
                        onChange={(e) => stlScaleSave(idx, parseFloat(e.target.value), setModels, selectedModelIndex)}
                        style={{ width: 60, marginLeft: 5 }}
                      />
                      <button onClick={() => stlScale(selectedModelIndex, idx)} style={{ marginLeft: 5 }}>
                        Apply Scale
                      </button>
                    </div>

                    <button onClick={stlDeleteSelected} className="button-red">
                      Remove Selected STL
                    </button>
                  </div>
                )}
              </div>
            ))}
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <input
              type="file"
              accept=".stl"
              onChange={stlAddNew}
              className="button-style input-file"
            />
            <button type="button" className="button-style button-blue">
              Add Model
            </button>
          </div>
        </div>

        <div className="custom-options-container">
          <div className="level-options">
            <label>
              <input
                type="checkbox"
                checked={showCaseParams}
                className='checkbox-style'
                onChange={(e) => setShowCaseParams(e.target.checked)}
              />
              Customize Case Options
            </label>

            {showCaseParams && (
              <div style={{ marginTop: '20px' }}>
                {Object.entries(caseParams).map(([key, value]) => (
                  <div key={key} className="param-row">
                    <label>{key}</label>
                    <input
                      type="number"
                      value={value}
                      onChange={(e) => handleOptionChange(key, parseFloat(e.target.value))}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="main-Canvas">
        {models.length > 0 && (
          <Scene
            models={models}
            caseMesh={caseMesh}
            lidMesh={lidMesh}
          />
        )}
      </div>
      
      <div className="progress-bar-container-outer">
        {progress > 0 && progress < 100 && (
          <div className="progress-bar-container">
            <div className='progress-bar' style={{ width: `${progress}%` }} />
            <span className='progress-text'>{Math.round(progress)}%</span>
          </div>
        )}
      </div>
    </div>
    </div>
  );
};

export default MakeCase;