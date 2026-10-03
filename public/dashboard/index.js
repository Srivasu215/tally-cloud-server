import spec from "./spec.json" with { type: "json" };

const startFunc = () => {
    try {
        const createDomElement = window.ks.jsonToTag.buildSpecElement(spec);
        console.log("createDomElement : ", createDomElement);
        // container.prepend(...createDomElement);

        const cont1 = document.getElementById("body");
        cont1.prepend(...createDomElement);

        let jVarLocalunitsSideId = document.getElementById('unitsSideId');

        jVarLocalunitsSideId.addEventListener("click", (event) => {
            alert("fff")
        });
    } catch (err) {
        console.error("Failed to render v27 sample:", err);
    }
};

startFunc();
