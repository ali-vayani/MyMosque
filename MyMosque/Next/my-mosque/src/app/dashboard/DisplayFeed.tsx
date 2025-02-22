import { useEffect, useState } from "react";
import { MosqueInfo, Post, } from "./post.types";
interface ModalProps {
    mosqueInfo: MosqueInfo;
    uid: string;
}

export default function DisplayFeed({ mosqueInfo, uid }: ModalProps) {
    const [posts, setPosts] = useState({} );
    const [events, setEvents] = useState({});
    useEffect(() => {
        if(mosqueInfo.posts) {
            setPosts(mosqueInfo.posts);
            setEvents(mosqueInfo.events)
        console.log(mosqueInfo)
        }
        
    }, [])

    return (
        <></>
    );
}