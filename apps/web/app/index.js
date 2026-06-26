import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createFileRoute } from '@tanstack/react-router';
export const Route = createFileRoute('/')({
    component: Index,
});
function Index() {
    return (_jsxs("div", { className: "p-4", children: [_jsx("h1", { className: "text-2xl font-bold", children: "RefBook" }), _jsx("p", { className: "mt-2", children: "Welcome to the Referee Application" })] }));
}
