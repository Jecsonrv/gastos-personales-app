import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

type PortalProps = {
    children: React.ReactNode;
};

export const Portal: React.FC<PortalProps> = ({ children }) => {
    const elRef = useRef<HTMLDivElement | null>(null);

    if (elRef.current === null) {
        elRef.current = document.createElement("div");
    }

    useEffect(() => {
        const modalRoot =
            document.getElementById("modal-root") ||
            (() => {
                const r = document.createElement("div");
                r.id = "modal-root";
                document.body.appendChild(r);
                return r;
            })();

        modalRoot.appendChild(elRef.current!);

        return () => {
            if (elRef.current && modalRoot.contains(elRef.current)) {
                modalRoot.removeChild(elRef.current);
            }
        };
    }, []);

    return elRef.current ? createPortal(children, elRef.current) : null;
};

export default Portal;
