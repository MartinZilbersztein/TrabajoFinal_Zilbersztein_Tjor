import { useContext, useEffect, useState } from "react";
import { HoleContext } from "../../../contexts/HoleContext";
import { getCategories } from "../../../services/hole-service";
import { shuffle } from "../../../helpers/sort-helper";
import "./CategoryButtons.css";

export default function CategoryButtons() {
    const { messages, sendMessage } = useContext(HoleContext);
    const [categories, setCategories] = useState([]);
    const categoryAlreadySet = messages.length > 0;

    useEffect(() => {
        getCategories().then((newCategories) => setCategories(shuffle(newCategories)));
    }, []);

    return (
        <div className="category-buttons">
            {categories.length === 0 && (
              <span className="utility-text">Cargando categorias...</span>
            )}

            {categories.map((c) => {
                const buttonStyle = (!categoryAlreadySet && c.color)
                    ? {
                        backgroundColor: `#${c.color}33`,
                        border: `solid #${c.color} 1px`,
                    }
                    : undefined;

                return (
                    <button
                        key={c.id}
                        onClick={() => sendMessage("Dime algo relacionado con " + c.name)}
                        disabled={categoryAlreadySet}
                        style={buttonStyle}
                    >
                        {c.name}
                    </button>
                );
            })}
        </div>
    );
}
