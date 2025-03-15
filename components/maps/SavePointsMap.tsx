"use client";

import { Button } from "../ui/button";

const SavePointsMap = ({ points, onSetCoordinatesSaved }: { points: number[][], onSetCoordinatesSaved: (coordinates: number[][]) => void }) => {
    // Hàm lưu file TXT
    const saveToFile = (filename: string, data: string) => {
        const blob = new Blob([data], { type: "text/plain" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Xử lý lưu hoặc tải file
    const handleSaveAndGetMap = (e: any) => {
        e.preventDefault();
        const typeSelected = e.target.querySelector("input:checked")?.id;
        const action = (e.nativeEvent as SubmitEvent).submitter?.getAttribute("name");

        if (!typeSelected) {
            alert("Please select a type (Polyline, Rectangle, Circle).");
            return;
        }

        console.log(`Action: ${action}`);
        console.log(`Type selected: ${typeSelected}`);

        const filename = `${typeSelected}.txt`;

        if (action === "save") {
            if (points.length === 0) {
                alert("No points to save.");
                return;
            }

            // Chuyển tọa độ thành chuỗi
            const data = points.toString()

            console.log("Saving map...");
            saveToFile(filename, data);
        } else if (action === "get") {
            console.log("Getting map data...");
        
            const input = document.createElement("input");
            input.type = "file";
            input.accept = ".txt";
            input.onchange = (event: any) => {
                const file = event.target.files[0];
                if (!file) return;
        
                const reader = new FileReader();
                reader.onload = (e: any) => {
                    const content = e.target.result as string;
                    console.log("Loaded Points (Raw):", content);
        
                    // Chuyển chuỗi thành mảng các mảng
                    const loadedPoints = content
                        .trim() // Xóa khoảng trắng đầu/cuối
                        .split(",") // Tách từng giá trị theo dấu phẩy
                        .map((v, i, arr) => (i % 2 === 0 ? [parseFloat(v), parseFloat(arr[i + 1])] : null))
                        .filter((point) => point !== null) as number[][];
        
                    console.log("Formatted Points (Array of Arrays):", loadedPoints);
                    onSetCoordinatesSaved(loadedPoints);
                };
                reader.readAsText(file);
            };
            input.click();
        }
    };

    return (
        <form
            onSubmit={handleSaveAndGetMap}
            className="w-[150px] p-2 rounded-lg bg-white fixed right-1 bottom-[31%] z-[1000] flex flex-col"
        >
            <h3 className="font-bold text-[14px] text-center">Choose type</h3>
            <div className="border border-gray-300 p-2 rounded-lg">
                <div className="flex justify-between">
                    <label htmlFor="polyline">Polyline</label>
                    <input id="polyline" type="radio" name="shapeType" />
                </div>
                <div className="flex justify-between">
                    <label htmlFor="rectangle">Rectangle</label>
                    <input id="rectangle" type="radio" name="shapeType" />
                </div>
                <div className="flex justify-between">
                    <label htmlFor="circle">Circle</label>
                    <input id="circle" type="radio" name="shapeType" />
                </div>
            </div>
            <Button className="bg-black text-white hover:bg-gray-800 text-[12px] mt-2" name="save">
                Save Map
            </Button>
            <Button className="bg-gray-200 text-black hover:bg-gray-400 text-[12px] mt-2" name="get">
                Get Map
            </Button>
        </form>
    );
};

export default SavePointsMap;
