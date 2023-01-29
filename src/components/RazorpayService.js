import axios from "axios";
import React, { useEffect, useState } from "react";
import './form.css'

const baseURL = "http://localhost:8085/payments";

const RazorpayService = () => {

    const [userRequest, setUserRequest] = useState({
        customerName: "",
        emailId: "",
        phoneNumber: "",
        amount: 0
    });
    const [orderResponse, setOrderResponse] = useState({
        secretKey: "",
        razorpayOrderId: "",
        applicationFee: "",
        secretId: "",
        paymentGatewayName: ""
    });

    const [paymentResp, setPaymentResp] = useState({

    })

    const handleInput = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setUserRequest({ ...userRequest, [name]: value })
    }

    const createOrder = async () => {
        try {
            await axios.post(baseURL + "/createOrder", {
                customerName: userRequest.customerName,
                emailId: userRequest.emailId,
                phoneNumber: userRequest.phoneNumber,
                amount: userRequest.amount
            }).then((response) => {
                console.log("Order Created: " + response.data.razorpayOrderId)
                setOrderResponse(response.data);
                console.log("Payment response updated successfully")
            }
            );
        } catch (error) {
            alert("There is an issue in creating an order..." + error)
        }
    }
    const displayRazorpay = async (amount) => {
        const res = await loadScript(
            "https://checkout.razorpay.com/v1/checkout.js"
        );
        if (!res) {
            alert("You have an error in processing...Failed to load Razorpay SDK");
            return;
        }
        console.log("User Response from displayRazorpay: " + orderResponse);
        const options = {
            key: orderResponse.secretId,
            order_id: orderResponse.razorpayOrderId,
            currency: "INR",
            amount: orderResponse.applicationFee * 100,
            name: "Razorpay Payment with Sanjeeb",
            description: "Test Mode Payment with Razorpay",
            handler: (response) => {
                updateResponse(response);
                console.log(response);
                alert(response.razorpay_payment_id);
                alert("Payment Success");
            }

        };
        console.log(options);
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();

        setOrderResponse({
            applicationFee: "",
            paymentGatewayName: "",
            razorpayOrderId: "",
            secretId: "",
            secretKey: ""
        })
    }

    const loadScript = (src) => {
        return new Promise((resolve) => {
            const script = document.createElement("script")
            script.src = src;

            script.onload = () => {
                resolve(true)
            }
            script.onerror = () => {
                resolve(false)
            }

            document.body.appendChild(script);
        })
    }

    const updateResponse = (response) => {
        axios.put(baseURL + "/updateOrder", {
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id
        })
    }

    useEffect(() => {
        displayRazorpay();
    }, [orderResponse.applicationFee > 0]);

    const handleSubmit = (e) => {
        e.preventDefault();
        alert("Are you sure to proceed with payment ?")
        createOrder();

        setUserRequest({
            customerName: "",
            emailId: "",
            phoneNumber: "",
            amount: 0
        })
    }

    return (
        <div className="form-box">
            <h5>User Payment System</h5>
            <form>
                <div>
                    <label htmlFor="customerName">Your Name</label>
                    <input type="text" autoComplete="off"
                        name="customerName"
                        id="customerName"
                        value={userRequest.customerName}
                        onChange={handleInput} />
                </div>
                <div>
                    <label htmlFor="emailId">Your Email</label>
                    <input type="text" autoComplete="off"
                        name="emailId"
                        id="emailId"
                        value={userRequest.emailId}
                        onChange={handleInput} />
                </div>
                <div>
                    <label htmlFor="phoneNumber">Phone Number</label>
                    <input type="text" autoComplete="off"
                        name="phoneNumber"
                        id="phoneNumber"
                        value={userRequest.phoneNumber}
                        onChange={handleInput} />
                </div>
                <div>
                    <label htmlFor="amount">Amount to Pay</label>
                    <input type="number" autoComplete="off"
                        name="amount"
                        id="amount"
                        value={userRequest.amount}
                        onChange={handleInput} />
                </div>

                <button id="nextBtn" className="nextBtn" type="submit" onClick={handleSubmit}>Do Payment</button>
            </form>

            <div>
                <h4>USER Request</h4>
                <p>{userRequest.customerName}</p>
                <p>{userRequest.emailId}</p>
                <p>{userRequest.phoneNumber}</p>
                <p style={{ color: 'red', fontWeight: 'bold' }}>
                    {userRequest.amount > 0 && "INR " + userRequest.amount}
                </p>
            </div>
            <div>
                <h3>USER Response</h3>
                <p>{orderResponse.secretId}</p>
                <p>{orderResponse.secretKey}</p>
                <p>{orderResponse.razorpayOrderId}</p>
                <p>{orderResponse.paymentGatewayName}</p>
                <p>{orderResponse.applicationFee}</p>
            </div>
        </div>
    )
}

export default RazorpayService;