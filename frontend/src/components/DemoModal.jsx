import { Modal, Box } from "@mui/material";
import { useContext,useEffect,useState } from "react";
import { Context } from "../store/context";

const DemoModal = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const relativeHeight = ((windowWidth * 0.75) / 16) * 9;
  const { store, actions } = useContext(Context);

  const handleResize = () => {
    setWindowWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: windowWidth * 0.75,
    height: relativeHeight,
    boxShadow: 24,
    bgcolor: "background.paper",
  };

  return (
    <>
      <Modal
        open={store.modalView}
        onClose={() => {
          actions.modalToggle(false);
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <iframe
            width={windowWidth * 0.75}
            height={relativeHeight}
            src="https://www.youtube.com/embed/p8vgaGH6w5A?si=WwQyJp3jGSzRruW_"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        </Box>
      </Modal>
    </>
  );
};
export default DemoModal;
