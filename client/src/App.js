import React from "react";
import Modal from "react-modal";
import axios from "axios";
import "animate.css";

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

const aidPlaceholder =
  "Describe the reasons that you are requesting aid. Ideally, all requests will be filled, but in the case that there are too many, we will try to prioritize medical needs, food, and rent assistance.";

const aidFlashMessage =
  "Aid request submitted! We will try to respond and coordinate the aid payment within 1-3 days";

const offerPlaceholder =
  "Let us know how you'd like to help out! Any contribution is helpful!";

const offerFlashMessage =
  "Thank you for reaching out! We will try to respond and coordinate with you within 1-3 days";

Modal.setAppElement("#root");

function App() {
  var subtitle;
  const [fadeOut, setFadeOut] = React.useState(false);
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [modalStyle, setModalStyle] = React.useState("");
  const [flashMessage, setFlashMessage] = React.useState("");
  const [name, setName] = React.useState("");
  const [nameError, setNameError] = React.useState("");
  const [amount, setAmount] = React.useState(0);
  const [amountError, setAmountError] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [emailError, setEmailError] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [messageError, setMessageError] = React.useState("");
  const [socialMedia, setSocialMedia] = React.useState("");
  const [socialMediaError, setSocialMediaError] = React.useState("");

  function openModal(style) {
    setIsOpen(true);
    setModalStyle(style);
  }

  function afterOpenModal() {
    subtitle.style.color = "#f00";
  }

  function closeModal() {
    setIsOpen(false);
    setFadeOut(false);
    setModalStyle("");
    setName("");
    setNameError("");
    setAmount("");
    setAmountError("");
    setEmail("");
    setEmailError("");
    setMessage("");
    setMessageError("");
    setSocialMedia("");
    setSocialMediaError("");
  }

  function sendEmail() {
    if (
      name &&
      ((modalStyle === "aid" && amount) || modalStyle === "offer") &&
      ((modalStyle === "aid" && socialMedia) || modalStyle === "offer") &&
      message &&
      email &&
      nameError === "" &&
      ((modalStyle === "aid" && amountError === "") ||
        modalStyle === "offer") &&
      ((modalStyle === "aid" && socialMediaError === "") ||
        modalStyle === "offer") &&
      messageError === "" &&
      emailError === ""
    ) {
      var emailBody = { name, amount, message, email, socialMedia };
      axios
        .post("/", {
          emailBody: emailBody,
          modalStyle: modalStyle,
        })
        .then((res) => {
          try {
            if (res.status === 200) {
              setFlashMessage(
                modalStyle === "aid" ? aidFlashMessage : offerFlashMessage
              );
              setTimeout(() => {
                setFadeOut(true);
                setTimeout(() => {
                  setFlashMessage("");
                  setFadeOut(false);
                }, 500);
              }, 3000);
              closeModal();
            } else {
              closeModal();
              setTimeout(() => {
                setFadeOut(true);
                setTimeout(() => {
                  setFlashMessage("");
                  setFadeOut(false);
                }, 500);
              }, 3000);
              setFlashMessage("Sorry, something went wrong. Please try again");
            }
          } catch (err) {
            closeModal();
            setTimeout(() => {
              setFadeOut(true);
              setTimeout(() => {
                setFlashMessage("");
                setFadeOut(false);
              }, 500);
            }, 3000);
            setFlashMessage("Sorry, something went wrong. Please try again");
          }
        });
    } else {
      console.log(
        name &&
          ((modalStyle === "aid" && amount) || modalStyle === "offer") &&
          ((modalStyle === "aid" && socialMedia) || modalStyle === "offer") &&
          message &&
          email &&
          nameError === "" &&
          ((modalStyle === "aid" && amountError === "") ||
            modalStyle === "offer") &&
          ((modalStyle === "aid" && socialMediaError === "") ||
            modalStyle === "offer") &&
          messageError === "" &&
          emailError === ""
      );
      if (name === "") {
        setNameError("Name is required");
      }
      if ((amount === 0 || amount === "") && modalStyle === "aid") {
        setAmountError("Amount is required");
      }
      if (email === "") {
        setEmailError("Email is required");
      }
      if (message === "") {
        setMessageError("Message is required");
      }
      if (socialMedia === "") {
        setSocialMediaError("Social media account is required");
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
        if (name === "Name" || name === "Message") {
          error =
            name +
            " cannot contain the characters: " +
            whichCharactersAreInvalidByRegexPattern(text, inverse);
        } else if (name === "Amount") {
          error = "Number must be less than 1000";
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
    } else if (name === "Social media account") {
      setSocialMedia(value);
      setSocialMediaError(error);
    }
  }

  return (
    <div>
      <div
        className={
          (fadeOut ? "animate__animated animate__fadeOutUp" : "") +
          (flashMessage !== "" ? " flash-message" : " no-flash-message")
        }
        onClick={() => setFadeOut(true)}
      >
        {flashMessage}
      </div>
      <h1>Bean Relief Fund</h1>
      <h2 className="relief-fund-desc">
        A mutual aid fund set up by{" "}
        <a href="https://kassmanben.com" target="_blank" rel="noreferrer">
          Ben Kassman
        </a>
        , with contributions from friends. Each month, this pool of money will
        be made available to anyone who needs it. Any remaining money in the
        pool at the end of the month will be donated to a larger mutual aid
        fund.
      </h2>
      <h3>January - $390 remaining</h3>
      <button onClick={() => openModal("aid")}>Request Aid</button>
      <button onClick={() => openModal("offer")}>Contribute</button>
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel={
          modalStyle === "aid" ? "Aid Request" : "Contribution Request"
        }
      >
        <h2 ref={(_subtitle) => (subtitle = _subtitle)}>
          {modalStyle === "aid" ? "Aid Request" : "Contribution Request"}
        </h2>
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
                  /^[a-zàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžßÇŒÆČŠŽ∂ð ,.'-]{1,250}$/giu,
                  /[^a-zàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžßÇŒÆČŠŽ∂ð\s,.'-]/giu,
                  "Name"
                );
              }}
            ></input>
            <small className={nameError === "" ? "hidden" : "visible"}>
              {nameError}
            </small>
          </div>
          {modalStyle === "aid" && (
            <div className="form-group">
              <label htmlFor="amount">Amount Requesting ($)*</label>
              <input
                type="number"
                name="amount"
                onFocus={() => setAmountError("")}
                onBlur={(e) => {
                  onBlur(e.target.value, /^[\d]{1,3}$/giu, "", "Amount");
                }}
              ></input>
              <small className={amountError === "" ? "hidden" : "visible"}>
                {amountError}
              </small>
            </div>
          )}
          <div className="form-group">
            <label htmlFor="email">Email*</label>
            <input
              type="text"
              name="email"
              onFocus={() => setEmailError("")}
              onBlur={(e) => {
                onBlur(
                  e.target.value,
                  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/giu,
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
            <label htmlFor="message">
              {modalStyle === "aid"
                ? "How will this aid money be used?*"
                : "How would you like to contribute?*"}
            </label>
            <textarea
              rows="7"
              name="message"
              onFocus={() => setMessageError("")}
              onBlur={(e) => {
                onBlur(
                  e.target.value,
                  /^[a-z\d\-_\s!"#$%&'()*+,-.:;<=>?@[\]^_~]+$/giu,
                  /[^a-z\d\-_\s!"#$%&'()*+,-./:;<=>?@[\]^/_~]+$/giu,
                  "Message"
                );
              }}
              placeholder={
                modalStyle === "aid" ? aidPlaceholder : offerPlaceholder
              }
            ></textarea>
            <small className={messageError === "" ? "hidden" : "visible"}>
              {messageError}
            </small>
          </div>
          {modalStyle === "aid" && (
            <div className="form-group">
              <label htmlFor="socialMedia">Social Media Account*</label>
              <textarea
                rows="7"
                name="socialMedia"
                onFocus={() => setSocialMediaError("")}
                onBlur={(e) => {
                  onBlur(
                    e.target.value,
                    /^[a-z\d\-_\s!"#$%&'()*+,-.:;<=>?@[\]^_~\/]+$/giu,
                    /[^a-z\d\-_\s!"#$%&'()*+,-./:;<=>?@[\]^/_~\/]+$/giu,
                    "Social media account"
                  );
                }}
                placeholder="Due to the prevalence of scammers, please provide an active social media account where we can verify your identity. We apologize for this additional step."
              ></textarea>
              <small className={socialMediaError === "" ? "hidden" : "visible"}>
                {socialMediaError}
              </small>
            </div>
          )}
        </form>
        <button onClick={sendEmail}>Send</button>
        <button onClick={closeModal}>Cancel</button>
      </Modal>
    </div>
  );
}

export default App;
