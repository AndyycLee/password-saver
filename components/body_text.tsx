
const BodyText = ({user}) => (
  <h1>
    Enjoy your{" "}
    <a
      className="App-link"
      href="https://leetcode.com/"
      target="_blank"
      rel="noopener noreferrer">
        <span className="orange">LeetCode</span>
    </a>{" "}
    training{user ? ` ${user.displayName}` : ""}!
  </h1>
);

export default BodyText;
