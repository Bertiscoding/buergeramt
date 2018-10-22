import React from "react";

const Home = props => {
    const name = props.user.email.substring(0, props.user.email.lastIndexOf("@"));

    return (
        <div className="container__home">
            <h1>hello {props.user ? name : "Stranger"}</h1>
            <p>Please check your inbox.</p>
        </div>
    );
};

export default Home;
