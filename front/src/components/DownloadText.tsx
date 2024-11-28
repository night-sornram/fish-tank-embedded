interface Props {
  srcs: string[];
}

export default function DownloadTextFile(prop: Props) {
  const handleDownload = () => {
    const text = prop.srcs.join("\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "sources.txt"; // Filename
    link.click();
    URL.revokeObjectURL(url);
  };

  return <button onClick={handleDownload}>Download Text File</button>;
}
