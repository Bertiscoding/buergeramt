import React from "react";

const Home = props => {
    const name = props.user.email.substring(0, props.user.email.lastIndexOf("@"));

    return (
        <div className="container">
            <h1>Hello, {props.user ? name : "Stranger"}!</h1>
            <p>
                We've sent you and email with the document to sign. <br /> Please check your account.
            </p>
        </div>
    );
};

export default Home;
