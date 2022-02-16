import React, { useState, useContext, createContext } from "react";

interface AppContextInterface {
  open: boolean;
  setOpen: (next: boolean) => void;
}

const ModalContext = createContext<AppContextInterface | null>(null);

export function ProvideModal({ children }) {
  const modal = useProvideModal();
  return (
    <ModalContext.Provider value={modal}>{children}</ModalContext.Provider>
  );
}

export const useModal = () => {
  return useContext(ModalContext);
};

function useProvideModal() {
  const [open, setOpen] = useState<boolean>(false);

  return {
    open,
    setOpen,
  };
}
