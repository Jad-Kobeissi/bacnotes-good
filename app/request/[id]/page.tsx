"use client";
import Nav from "@/app/Nav";
import { TRequest } from "@/app/types";
import axios from "axios";
import { getCookie } from "cookies-next";
import moment from "moment";
import React, { useEffect, useState } from "react";

export default function Request({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [request, setRequest] = useState<TRequest | null>(null);
  const fetchRequest = () => {
    setLoading(true);
    setError("");
    axios
      .get(`/api/request/${id}`, {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      })
      .then((res) => {
        setRequest(res.data);
      })
      .catch((err) => {
        setError(err.response.data);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    fetchRequest();
  }, []);
  return (
    <>
      <Nav />
      <div>
        {request && (
          <div className="flex flex-col items-center justify-center pt-[30vh] text-center">
            <div>
              <h1>Username: {request.author.username}</h1>
              <h1>{request.title}</h1>
              <p className="text-(--secondary-text)">{request.content}</p>
            </div>
            <h1 className="text-(--secondary-text) mt-3">
              {moment(request.createdAt).fromNow()}
            </h1>
          </div>
        )}
      </div>
    </>
  );
}
