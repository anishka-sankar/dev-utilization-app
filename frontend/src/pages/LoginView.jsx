import { useState } from "react";
import { BarChart3 } from "lucide-react";

const LoginView = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <BarChart3 size={48} />
          <h1>Developer Utilization</h1>
          <p>Track, Monitor, Deliver</p>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Sign In</button>
        </form>
        <div className="login-hint">
          <p>Demo credentials:</p>
          <p>
            <strong>Email:</strong> john.doe@example.com
          </p>
          <p>
            <strong>Password:</strong> password123
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
