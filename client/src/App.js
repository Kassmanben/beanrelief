import React from "react";
import Modal from "react-modal";
import axios from "axios";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "350px",
    boxShadow: "0 7px 30px -10px rgba(150, 170, 180, 0.5)",
  },
};

Modal.setAppElement("#root");

function App() {
  var subtitle;
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [flashMessage, setFlashMessage] = React.useState("");
  const [name, setName] = React.useState("");
  const [nameError, setNameError] = React.useState("");
  const [amount, setAmount] = React.useState(0);
  const [amountError, setAmountError] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [emailError, setEmailError] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [messageError, setMessageError] = React.useState("");

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    subtitle.style.color = "#f00";
  }

  function closeModal() {
    setIsOpen(false);
  }

  function sendEmail() {
    if (
      name &&
      amount &&
      message &&
      email &&
      nameError === "" &&
      amountError === "" &&
      messageError === "" &&
      emailError === ""
    ) {
      var emailBody = { name, amount, message, email };
      axios
        .post("/", {
          emailBody: emailBody,
        })
        .then((res) => {
          try {
            if (res.status === 200) {
              closeModal();
              setFlashMessage(
                "Aid request submitted! We will try to respond and coordinate the aid payment within 1-3 days"
              );
            } else {
              closeModal();
              setFlashMessage("Sorry, something went wrong. Please try again");
            }
          } catch (err) {
            closeModal();
            setFlashMessage("Sorry, something went wrong. Please try again");
          }
        });
    } else {
      if (name === "") {
        setNameError("Name is required");
      }
      if (amount === 0 || amount === "") {
        setAmountError("Amount is required");
      }
      if (email === "") {
        setEmailError("Email is required");
      }
      if (message === "") {
        setMessageError("Message is required");
      }
    }
  }

  function isValidByRegexPattern(text, pattern) {
    return pattern.test(String(text).toLowerCase());
  }

  function whichCharactersAreInvalidByRegexPattern(text, pattern) {
    var invalidChars = text.match(pattern);
    if (invalidChars) {
      return invalidChars.join("").replace(/(.)(?=.*\1)/g, "");
    }
    return "";
  }

  function onBlur(text, pattern, inverse, name) {
    var value = "";
    var error = "";
    if (isValidByRegexPattern(text, pattern)) {
      value = text;
    } else {
      if (text === "") {
        error = name + " is required";
      } else {
        if (name === "Name" && name === "Message") {
          error =
            name +
            " cannot contain the characters: " +
            whichCharactersAreInvalidByRegexPattern(text, inverse);
        } else if (name === "Amount") {
          error = "Number must be less that 1000";
        } else if (name === "Email") {
          error = "Invalid email address";
        }
      }
    }
    if (name === "Name") {
      setName(value);
      setNameError(error);
    } else if (name === "Amount") {
      setAmount(value);
      setAmountError(error);
    } else if (name === "Email") {
      setEmail(value);
      setEmailError(error);
    } else if (name === "Message") {
      setMessage(value);
      setMessageError(error);
    }
  }

  return (
    <div>
      <div className="flash-message">{flashMessage}</div>
      <h1>Bean Relief Fund</h1>
      <h2>January - $710 remaining</h2>
      <button onClick={openModal}>Request Aid</button>
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Aid Description"
      >
        <h2 ref={(_subtitle) => (subtitle = _subtitle)}>Aid Description</h2>
        <form>
          <div className="form-group">
            <label htmlFor="name">Name*</label>
            <input
              type="text"
              name="name"
              onFocus={() => setNameError("")}
              onBlur={(e) => {
                onBlur(
                  e.target.value,
                  /^[a-zàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžßÇŒÆČŠŽ∂ð ,.'-]{1,250}$/iu,
                  /[^a-zàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžßÇŒÆČŠŽ∂ð\s,.'-]/giu,
                  "Name"
                );
              }}
            ></input>
            <small className={nameError === "" ? "hidden" : "visible"}>
              {nameError}
            </small>
          </div>
          <div className="form-group">
            <label htmlFor="amount">Amount Requesting ($)*</label>
            <input
              type="number"
              name="amount"
              onFocus={() => setAmountError("")}
              onBlur={(e) => {
                onBlur(e.target.value, /^[\d]{1,3}$/iu, "", "Amount");
              }}
            ></input>
            <small className={amountError === "" ? "hidden" : "visible"}>
              {amountError}
            </small>
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="text"
              name="email"
              onFocus={() => setEmailError("")}
              onBlur={(e) => {
                onBlur(
                  e.target.value,
                  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/iu,
                  "",
                  "Email"
                );
              }}
            ></input>
            <small className={emailError === "" ? "hidden" : "visible"}>
              {emailError}
            </small>
          </div>
          <div className="form-group">
            <label htmlFor="message">What will this be used for?*</label>
            <textarea
              rows="7"
              name="message"
              onFocus={() => setMessageError("")}
              onBlur={(e) => {
                onBlur(
                  e.target.value,
                  /^[a-z\d\-_\s!"#$%&'()*+,-.:;<=>?@[\]^_~]+$/iu,
                  /[^a-z\d\-_\s!"#$%&'()*+,-./:;<=>?@[\]^/_~]+$/i,
                  "Message"
                );
              }}
              placeholder="Describe the reasons that you are requesting aid. Ideally, all requests will be filled, but in the case that there are too many, we will try to prioritize medical needs, food, and rent assistance."
            ></textarea>
            <small className={messageError === "" ? "hidden" : "visible"}>
              {messageError}
            </small>
          </div>
        </form>
        <button onClick={sendEmail}>Send</button>
        <button onClick={closeModal}>Cancel</button>
      </Modal>
    </div>
  );
}

export default App;
