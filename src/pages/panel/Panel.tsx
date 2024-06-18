import React, { useState } from "react";
import "@pages/panel/Panel.css";
import CryptoJS from "crypto-js";
import { X } from "lucide-react";

export default function Panel(): JSX.Element {
  const [originData, setOriginData] = useState("");
  const [siteCode, setSiteCode] = useState("");
  const [siteTime, setSiteTime] = useState("");
  const [error, setError] = useState("");
  const [results, setResults] = useState<{ data: string; expanded: boolean }[]>(
    [],
  );

  function decrypt() {
    if (originData.length === 0) {
      setError("請輸入待解密的資料");
      return;
    }

    if (siteCode.length < 8) {
      setError("siteCode 至少要有八位數");
      return;
    }

    if (siteTime.length < 8) {
      setError("siteTime 至少要有八位數");
      return;
    }

    const siteTimeLast8 = siteTime.slice(-8);
    const code = siteCode + siteTimeLast8;
    setError(""); // 清除错误信息

    // 去掉 originData 前后的引号
    const cleanedData = originData.replace(/^"|"$/g, "");

    try {
      const key = CryptoJS.enc.Utf8.parse(code);
      const decrypted = CryptoJS.AES.decrypt(cleanedData, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
      });
      const decryptedData = decrypted.toString(CryptoJS.enc.Utf8);

      // 解析 JSON 数据并格式化
      const jsonResult = JSON.stringify(JSON.parse(decryptedData), null, 2);
      setResults([...results, { data: jsonResult, expanded: false }]);
      setOriginData("");
      setSiteCode("");
      setSiteTime("");
    } catch (error) {
      setError("解密失敗，請確保數據和密鑰正確");
      console.error("Decryption error:", error);
    }
  }

  function handlePaste(event: React.ClipboardEvent<HTMLInputElement>) {
    const paste = event.clipboardData.getData("text");
    const siteCodeMatch = paste.match(/Site:\s*([^\s]+)/);
    const siteTimeMatch = paste.match(/Sitetime:\s*([^\s]+)/);

    if (siteCodeMatch && siteTimeMatch) {
      setSiteCode(siteCodeMatch[1]);
      setSiteTime(siteTimeMatch[1]);
      event.preventDefault();
    }
  }

  function deleteResult(index: number) {
    const newResults = results.filter((_, i) => i !== index);
    setResults(newResults);
  }

  function toggleExpand(index: number) {
    const newResults = results.map((result, i) => {
      if (i === index) {
        return { ...result, expanded: !result.expanded };
      }
      return result;
    });
    setResults(newResults);
  }

  return (
    <div className="flex h-full flex-col gap-4 bg-slate-950 p-4">
      <input
        className="border-1 h-10 w-full rounded-lg border-white pl-2"
        type="text"
        value={originData}
        onChange={(e) => setOriginData(e.target.value)}
        placeholder="請輸入 待解密字串"
      />
      <input
        className="border-1 h-10 w-full rounded-lg border-white pl-2"
        type="text"
        value={siteCode}
        onChange={(e) => setSiteCode(e.target.value)}
        onPaste={handlePaste}
        placeholder="請輸入 siteCode"
      />
      <input
        className="border-1 h-10 w-full rounded-lg border-white pl-2"
        type="text"
        value={siteTime}
        onChange={(e) => setSiteTime(e.target.value)}
        placeholder="請輸入 siteTime"
      />
      <button className="h-10 rounded-lg bg-slate-50" onClick={decrypt}>
        Decrypt
      </button>
      {error && (
        <div className="flex h-20 items-center justify-center bg-red-500 text-lg text-white">
          {error}
        </div>
      )}
      <div className="gap-4">
        {results.map((result, index) => (
          <div key={index} className="relative mb-4 rounded-lg bg-gray-800 p-4">
            <div className="flex items-center justify-between">
              <button
                className="mt-2 h-8 w-[80%] rounded-lg bg-blue-500 text-white"
                onClick={() => toggleExpand(index)}
              >
                {result.expanded ? "折疊" : "展開"}
              </button>
              <X
                className="h-8 w-8 text-white"
                onClick={() => deleteResult(index)}
              />
            </div>
            {result.expanded && (
              <pre className="mt-2 overflow-auto whitespace-pre-wrap text-white">
                {result.data}
              </pre>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
