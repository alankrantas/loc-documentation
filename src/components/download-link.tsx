import React, { FunctionComponent } from "react";

interface DownloadLinkProps {
    raw: string;
    fileName: string;
    linkText: string;
}

const DownloadLink: FunctionComponent<DownloadLinkProps> = ({
    raw,
    fileName,
    linkText,
}) => {
    const data = new Blob([raw], { type: "text/plain;charset=utf-8" });
    const downloadLink = URL.createObjectURL(data);
    return (
        <a download={fileName} href={downloadLink}>
            {linkText}
        </a>
    );
};

export default DownloadLink;
