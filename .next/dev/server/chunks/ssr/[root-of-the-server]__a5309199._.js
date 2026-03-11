module.exports = [
"[externals]/worker_threads [external] (worker_threads, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("worker_threads", () => require("worker_threads"));

module.exports = mod;
}),
"[project]/src/components/MapOverlay.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MapOverlay
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$map$2d$gl$2f$dist$2f$maplibre$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/react-map-gl/dist/maplibre.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$vis$2e$gl$2f$react$2d$maplibre$2f$dist$2f$components$2f$map$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__Map__as__default$3e$__ = __turbopack_context__.i("[project]/node_modules/@vis.gl/react-maplibre/dist/components/map.js [app-ssr] (ecmascript) <export Map as default>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$deck$2e$gl$2f$react$2f$dist$2f$deckgl$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__DeckGL$3e$__ = __turbopack_context__.i("[project]/node_modules/@deck.gl/react/dist/deckgl.js [app-ssr] (ecmascript) <export default as DeckGL>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$deck$2e$gl$2f$layers$2f$dist$2f$scatterplot$2d$layer$2f$scatterplot$2d$layer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ScatterplotLayer$3e$__ = __turbopack_context__.i("[project]/node_modules/@deck.gl/layers/dist/scatterplot-layer/scatterplot-layer.js [app-ssr] (ecmascript) <export default as ScatterplotLayer>");
'use client';
;
;
;
;
;
;
function MapOverlay() {
    const [data, setData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        // Connect to Server-Sent Events (SSE) for real-time API integrations
        const evtSource = new EventSource('/api/emissions/stream');
        evtSource.onmessage = (event)=>{
            const parsed = JSON.parse(event.data);
            if (parsed.success) {
                setData(parsed.data);
            }
        };
        return ()=>evtSource.close();
    }, []);
    const layer = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$deck$2e$gl$2f$layers$2f$dist$2f$scatterplot$2d$layer$2f$scatterplot$2d$layer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ScatterplotLayer$3e$__["ScatterplotLayer"]({
        id: 'emissions-scatterplot',
        data,
        pickable: true,
        opacity: 0.9,
        stroked: true,
        filled: true,
        radiusScale: 1000,
        radiusMinPixels: 10,
        radiusMaxPixels: 50,
        lineWidthMinPixels: 2,
        getPosition: (d)=>[
                d.lng,
                d.lat
            ],
        getFillColor: (d)=>{
            if (d.emissionPercentage > 60) return [
                255,
                0,
                0
            ]; // Red
            if (d.emissionPercentage > 30) return [
                255,
                215,
                0
            ]; // Yellow
            return [
                0,
                200,
                0
            ]; // Green
        },
        getLineColor: [
            255,
            255,
            255,
            100
        ],
        getRadius: (d)=>Math.max(10, d.emissionPercentage),
        transitions: {
            getRadius: {
                duration: 500
            },
            getFillColor: {
                duration: 500
            }
        }
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-full h-full min-h-[500px] relative rounded-2xl overflow-hidden glass-panel border border-[#ffffff10]",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$deck$2e$gl$2f$react$2f$dist$2f$deckgl$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__DeckGL$3e$__["DeckGL"], {
            initialViewState: {
                longitude: 20,
                latitude: 30,
                zoom: 2,
                pitch: 30,
                bearing: 0
            },
            controller: true,
            layers: [
                layer
            ],
            getTooltip: ({ object })=>object && {
                    html: `
              <div style="padding: 4px;">
                <h3 style="font-weight: bold; font-size: 16px; margin-bottom: 8px; border-bottom: 1px solid rgba(255,255,255,0.2); padding-bottom: 4px; color: #7B3FE4;">${object.zone}</h3>
                <div style="font-size: 13px; color: #fff; margin-bottom: 4px;">Total Emissions: <strong>${object.emissionPercentage}%</strong></div>
                <div style="display: flex; justify-content: space-between; font-size: 11px; color: rgba(255,255,255,0.7); margin-bottom: 2px;">
                  <span>Traffic Index:</span> <span>${Math.round(object.trafficLevel)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 11px; color: rgba(255,255,255,0.7);">
                  <span>AQI (PM2.5):</span> <span>${Math.round(object.infrastructure)}</span>
                </div>
              </div>
            `,
                    style: {
                        backgroundColor: 'rgba(10, 10, 10, 0.95)',
                        color: '#fff',
                        borderRadius: '8px',
                        border: '1px solid rgba(123, 63, 228, 0.4)',
                        boxShadow: '0 8px 32px rgba(123, 63, 228, 0.15)',
                        fontFamily: 'system-ui, sans-serif'
                    }
                },
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$vis$2e$gl$2f$react$2d$maplibre$2f$dist$2f$components$2f$map$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__Map__as__default$3e$__["default"], {
                mapStyle: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
                reuseMaps: true
            }, void 0, false, {
                fileName: "[project]/src/components/MapOverlay.tsx",
                lineNumber: 84,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/MapOverlay.tsx",
            lineNumber: 51,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/MapOverlay.tsx",
        lineNumber: 50,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__a5309199._.js.map