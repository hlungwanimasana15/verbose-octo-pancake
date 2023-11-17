import { Button } from "@mui/material";

export default function button({ text, buttonFunction }) {
    return (
        <>
            <Button variant="contained" style={{ backgroundColor: "#1C3F53", width: "50%", borderRadius: 20 }} onClick={() => buttonFunction()}>{text}</Button>
        </>
    )
}