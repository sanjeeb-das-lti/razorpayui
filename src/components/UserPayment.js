
import React from "react"
import { useState } from "react"
import axios from 'axios'

const baseURL = "https://jsonplaceholder.typicode.com/posts";


const UserPayment = () => {
    const [post, setPost] = React.useState({
        title: "My Body",
        body: "My body is a temple"
    });
    const [userPayment, setUserPayment] = useState({
        username: "",
        email: "",
        phone: "",
        amount: 0
    });
    const [myData, setMyData] = useState([]);
    const handleInput = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setUserPayment({ ...userPayment, [name]: value })
    }

    const handleSubmit = (e) => {
        alert("Heel")
        axios
            .post(baseURL, {
                title: "Hello World!",
                body: "This is a new post."
            })
            .then((response) => {
                setPost(response.data);
                console.log(response.data)
            });
        // try {
        //     axios
        //         .get("https://jsonplaceholder.typicode.com/posts")
        //         .then((response) => console.log(response))
        //     //console.log(myData);
        // } catch (error) {
        //     console.log(error)
        // }

    }

    return (
        <>
            <h2>User Payments</h2>
            <form action="submit">
                <div>
                    <label htmlFor="username">Your Name</label>
                    <input type="text" autoComplete="off"
                        value={userPayment.username}
                        onChange={handleInput}
                        name="username"
                        id="username" />
                </div>
                <div>
                    <label htmlFor="email">Email</label>
                    <input type="text" autoComplete="off"
                        value={userPayment.email}
                        onChange={handleInput}
                        name="email"
                        id="email" />
                </div>
                <div>
                    <label htmlFor="phone">Phone Number</label>
                    <input type="text" autoComplete="off"
                        value={userPayment.phone}
                        onChange={handleInput}
                        name="phone"
                        id="phone" />
                </div>
                <div>
                    <label htmlFor="amount">Amount To Pay</label>
                    <input type="number" autoComplete="off"
                        value={userPayment.amount}
                        onChange={handleInput}
                        name="amount"
                        id="amount" />
                </div>
                <button onClick={handleSubmit}>PAY</button>
            </form>
            <div>
                <p>{post.title}</p>
                <p>{post.body}</p>
            </div>
        </>
    )
}
export default UserPayment
