"use client"
import Error from "@/app/Error";
import Nav from "@/app/Nav";
import { TUser } from "@/app/types";
import axios from "axios";
import { getCookie } from "cookies-next";
import React, { useEffect, useState } from "react";

export default function Following({ params }: { params: Promise<{ id: string}>}) {
    const { id } = React.use(params)
    const [following, setFollowing] = useState<TUser[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const fetchFollowing = () => {
        setLoading(true)
        setError("")
        axios.get(`/api/user/following/${id}`, {
            headers: {
                Authorization: `Bearer ${getCookie("token")}`
            }
        }).then((res) => {
            console.log(res.data);
            setFollowing(res.data)
        }).catch((err) => {
            setError(err.response.data)
        }).finally(() => {
            setLoading(true)
        })
    }
    useEffect(() => {
        fetchFollowing()
    }, [])
    return <>
    <Nav />
    <div className="pt-[20vh]">
        {following.map((user) => <h1>{user.username}</h1>)}
        <Error className="text-center text-[1.2rem]">{error}</Error>
    </div>
    </>
}