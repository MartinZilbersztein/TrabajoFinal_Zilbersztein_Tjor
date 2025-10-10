import { useContext, useEffect, useState } from "react";
import { HoleContext } from "../../../contexts/HoleContext";
import { getCategories } from "../../../services/hole-service";
import "./CategoryButtons.css";

export default function CategoryButtons() {
    const { messages, sendMessage } = useContext(HoleContext);
    const [categories, setCategories] = useState([]);
    const categoryAlreadySet = messages.length > 0;

    useEffect(() => {
        getCategories().then(setCategories);
    }, []);

    return (
        <div className="category-buttons">
            {categories.map((c) => (
                <button key={c.id} onClick={() => {
                    sendMessage(c.name);
                }} disabled={categoryAlreadySet}>
                    {c.name}
                </button>
            ))}
        </div>
    );
}