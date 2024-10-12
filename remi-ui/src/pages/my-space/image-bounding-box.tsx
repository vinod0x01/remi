import { useState, useRef, useEffect } from "react";
import { BoxInputType } from "./types";

export type ImageWithBoundingBoxProps = {
    imageSrc: string | undefined;
    boxes: BoxInputType[];
};

const ImageWithBoundingBox = ({
    imageSrc,
    boxes,
}: ImageWithBoundingBoxProps) => {
    const [scale, setScale] = useState(1);
    const imgRef = useRef<HTMLImageElement>(null);

    // const boxWidth = x2 - x1;
    // const boxHeight = y2 - y1;

    useEffect(() => {
        const updateScale = () => {
            if (imgRef.current) {
                const newScale =
                    imgRef.current.width / imgRef.current.naturalWidth;
                setScale(newScale);
            }
        };

        const img = imgRef.current;
        if (img) {
            img.addEventListener("load", updateScale);
            updateScale(); // Initial scale update
        }

        return () => {
            if (img) {
                img.removeEventListener("load", updateScale);
            }
        };
    }, []);

    const renderBoxes = boxes.map((b) => (
        <div
            key={`bounding-box-${b.id}`}
            className="absolute border-2 border-red-500"
            style={{
                left: `${b.coordinates[0].x * scale}px`,
                top: `${b.coordinates[0].y * scale}px`,
                width: `${(b.coordinates[1].x - b.coordinates[0].x) * scale}px`,
                height: `${
                    (b.coordinates[1].y - b.coordinates[0].y) * scale
                }px`,
            }}
        >
            <span className="absolute top-0 left-0 bg-red-500 text-white px-1 text-sm">
                {b.box_name === "" ? `id: ${b.id}` : b.box_name}
            </span>
        </div>
    ));

    return (
        <div className="relative inline-block">
            <img
                ref={imgRef}
                src={imageSrc}
                alt="Image with bounding box"
                className="max-w-full h-auto"
            />
            {renderBoxes}
            {/* <div
                className="absolute border-2 border-red-500"
                style={{
                    left: `${x1 * scale}px`,
                    top: `${y1 * scale}px`,
                    width: `${boxWidth * scale}px`,
                    height: `${boxHeight * scale}px`,
                }}
            >
                <span className="absolute top-0 left-0 bg-red-500 text-white px-1 text-sm">
                    {label}
                </span>
            </div> */}
        </div>
    );
};

export default ImageWithBoundingBox;
