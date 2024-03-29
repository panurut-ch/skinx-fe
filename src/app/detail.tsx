import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

interface DetailPopupProps {
  open: boolean;
  selectedRowData: any[]; 
  onClose: () => void;
}

const DetailPopup: React.FC<DetailPopupProps> = ({
  open,
  selectedRowData,
  onClose,
}) => {
  console.log("selectedRowData", selectedRowData);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Post Details</DialogTitle>
      <DialogContent>
        {selectedRowData && (
          <>
            <p>
              <b>ID:</b> {selectedRowData[0]}
            </p>
            <p>
              <b>Title:</b> {selectedRowData[1]}
            </p>
            <p>
              <b>Content:</b>
              <div
                dangerouslySetInnerHTML={{
                  __html: selectedRowData[2].props.children,
                }}
              ></div>
            </p>
            <p>
              <b>Posted At:</b> {selectedRowData[3]}
            </p>
            <p>
              <b>Posted By:</b> {selectedRowData[4]}
            </p>
            {selectedRowData[5] && (
              <>
                <p>
                  <b>Tags:</b>
                </p>
                {selectedRowData[5].split(",").map((tag: string, index: number) => (
                  <p key={index}>{tag.trim()}</p>
                ))}
              </>
            )}
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DetailPopup;
