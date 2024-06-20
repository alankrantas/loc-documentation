import React, { FunctionComponent } from "react";
import Link from "@docusaurus/Link";
import { useColorMode } from "@docusaurus/theme-common";

interface ThemedLinkProps {
    link: string;
    text: string;
    lightStyle: string;
    darkStyle: string;
}

const ThemedLink: FunctionComponent<ThemedLinkProps> = ({
    link,
    text,
    lightStyle = "",
    darkStyle = "",
}) => {
    const { colorMode, setColorMode } = useColorMode();
    return (
        <Link
            to={link}
            className={colorMode === "light" ? lightStyle : darkStyle}
        >
            {text}
        </Link>
    );
};

export default ThemedLink;
