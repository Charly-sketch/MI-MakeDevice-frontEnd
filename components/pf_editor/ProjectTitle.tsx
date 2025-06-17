import React, { useState } from "react";
import { TextField, Typography, Box, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";

interface ProjectTitleProps {
  initialTitle: string;
  onTitleChange: (newTitle: string) => void;
  className?: string;
}

const ProjectTitle: React.FC<ProjectTitleProps> = ({
  initialTitle = "Untitled Project",
  onTitleChange,
  className,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(initialTitle);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleSave = () => {
    if (title.trim() !== "") {
      setTitle(title.trim());
    } else {
      setTitle(initialTitle); // Reset to initial title if empty
    }
    setIsEditing(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleSave();
    } else if (event.key === "Escape") {
      setTitle(initialTitle);
      setIsEditing(false);
    }
  };

  return (
    <Box className={className} display="flex" alignItems="center">
      {!isEditing && (
        <Typography variant="h6" fontWeight="bold">
          Project title:
        </Typography>
      )}

      {isEditing ? (
        <>
          <TextField
            value={title}
            onChange={handleTitleChange}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            autoFocus
            variant="outlined"
            size="small"
            fullWidth
          />
          <IconButton onClick={handleSave} size="small" sx={{ ml: 1 }}>
            <CheckIcon />
          </IconButton>
        </>
      ) : (
        <>
          <Typography variant="h6" component="h1" sx={{ fontStyle: "italic" }}>
            {title}
          </Typography>
          <IconButton onClick={handleEditClick} size="small" sx={{ ml: 1 }}>
            <EditIcon fontSize="small" />
          </IconButton>
        </>
      )}
    </Box>
  );
};

export default ProjectTitle;
