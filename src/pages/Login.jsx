import { useEffect, useRef, useState } from "react";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [faceOffset, setFaceOffset] = useState({ x: 0, y: 0, rotate: 0 });
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });
  const [bodySkew, setBodySkew] = useState(0);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const loaderRef = useRef(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const handleMouseMove = (event) => {
      const element = loaderRef.current;
      if (!element) {
        return;
      }

      if (isPasswordFocused) {
        return;
      }

      const bounds = element.getBoundingClientRect();
      const centerX = bounds.left + bounds.width / 2;
      const centerY = bounds.top + bounds.height / 2;

      const deltaX = event.clientX - centerX;
      const deltaY = event.clientY - centerY;

      const faceMax = 18;
      const eyeMax = 5;
      const rotationMax = 8;
      const bodySkewMax = 6;

      const normalizedX = Math.max(Math.min(deltaX / 150, 1), -1);
      const normalizedY = Math.max(Math.min(deltaY / 150, 1), -1);

      const faceX = faceMax * normalizedX;
      const faceY = faceMax * normalizedY;
      const eyesX = eyeMax * normalizedX;
      const eyesY = eyeMax * normalizedY;
      const rotate = rotationMax * normalizedX;
      const bodySkewValue = bodySkewMax * normalizedX * -1;

      setFaceOffset({ x: faceX, y: faceY, rotate });
      setEyeOffset({ x: eyesX, y: eyesY });
      setBodySkew(bodySkewValue);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isPasswordFocused]);

  useEffect(() => {
    if (!isPasswordFocused) {
      return;
    }

    setFaceOffset({ x: 0, y: 0, rotate: 0 });
    setEyeOffset({ x: 0, y: 0 });
    setBodySkew(0);
  }, [isPasswordFocused]);

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Login form submitted:", formData);
  };

  return (
    <>
      <section className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center px-4 py-16">
        <div className="flex w-full flex-col overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-black/5 md:flex-row">
          <div className="flex w-full flex-1 items-center justify-center bg-slate-50/80 p-10 text-center backdrop-blur">
            <div className="relative flex items-center justify-center">
              <div
                ref={loaderRef}
                className="login-loader"
                style={{
                  "--face-offset-x": `${faceOffset.x}px`,
                  "--face-offset-y": `${faceOffset.y}px`,
                  "--face-rotate": `${faceOffset.rotate}deg`,
                  "--eye-offset-x": `${eyeOffset.x}px`,
                  "--eye-offset-y": `${eyeOffset.y}px`,
                  "--body-skew": `${bodySkew}deg`,
                  "--eye-visible": isPasswordFocused ? 0 : 1,
                  "--eye-lid-opacity": isPasswordFocused ? 1 : 0,
                }}
              />
            </div>
          </div>

          <div className="flex w-full flex-1 items-center justify-center p-10">
            <div className="w-full max-w-md">
              <h2 className="text-3xl font-semibold tracking-tight text-slate-900">
                Login
              </h2>
              <p className="mt-4 text-sm text-slate-600">
                Enter your credentials to access your account.
              </p>

              <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label
                    className="block text-sm font-medium text-slate-700"
                    htmlFor="email"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="you@example.com"
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-slate-900 shadow-sm outline-none transition focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-100"
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-medium text-slate-700"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => setIsPasswordFocused(true)}
                    onBlur={() => setIsPasswordFocused(false)}
                    required
                    placeholder="••••••••"
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-slate-900 shadow-sm outline-none transition focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-100"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-sky-600 px-4 py-2 text-base font-semibold text-white shadow-sm transition hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
                >
                  Sign In
                </button>

                <p className="text-center text-sm text-slate-600">
                  Don&apos;t have an account yet?{" "}
                  <a
                    className="font-medium text-sky-600 hover:text-sky-500"
                    href="#"
                  >
                    Create Account
                  </a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      <style>
        {`
          .login-loader {
            width: 160px;
            height: 185px;
            position: relative;
            background: #fff;
            border-radius: 100px 100px 0 0;
            box-shadow: 0 20px 45px -20px rgba(15, 23, 42, 0.35);
            overflow: hidden;
            transform-origin: 50% 100%;
            transform: skewX(var(--body-skew, 0deg));
            transition: transform 0.2s ease-out;
          }

          .login-loader:after {
            content: "";
            position: absolute;
            width: 100px;
            height: 125px;
            left: 50%;
            top: 25px;
            transform: translate(calc(-50% + var(--face-offset-x, 0px)), var(--face-offset-y, 0px))
              rotate(var(--face-rotate, 0deg));
            transform-origin: 50% 45%;
            background-image:
              radial-gradient(circle, rgba(0, 0, 0, var(--eye-visible, 1)) 48%, transparent 55%),
              radial-gradient(circle, rgba(0, 0, 0, var(--eye-visible, 1)) 48%, transparent 55%),
              radial-gradient(circle, #fff 30%, transparent 45%),
              radial-gradient(circle, #000 48%, transparent 51%),
              linear-gradient(#000 20px, transparent 0),
              linear-gradient(#cfecf9 60px, transparent 0),
              radial-gradient(circle, #cfecf9 50%, transparent 51%),
              radial-gradient(circle, #cfecf9 50%, transparent 51%),
              linear-gradient(
                to bottom,
                transparent 46%,
                rgba(15, 23, 42, var(--eye-lid-opacity, 0)) 46%,
                rgba(15, 23, 42, var(--eye-lid-opacity, 0)) 54%,
                transparent 54%
              ),
              linear-gradient(
                to bottom,
                transparent 46%,
                rgba(15, 23, 42, var(--eye-lid-opacity, 0)) 46%,
                rgba(15, 23, 42, var(--eye-lid-opacity, 0)) 54%,
                transparent 54%
              );
            background-repeat: no-repeat;
            background-size:
              16px 16px,
              16px 16px,
              10px 10px,
              42px 42px,
              12px 3px,
              50px 25px,
              70px 70px,
              70px 70px,
              22px 6px,
              22px 6px;
            background-position:
              calc(25px + var(--eye-offset-x, 0px)) calc(10px + var(--eye-offset-y, 0px)),
              calc(55px + var(--eye-offset-x, 0px)) calc(10px + var(--eye-offset-y, 0px)),
              36px 44px,
              50% 30px,
              50% 85px,
              50% 50px,
              50% 22px,
              50% 45px,
              calc(25px + var(--eye-offset-x, 0px)) 18px,
              calc(55px + var(--eye-offset-x, 0px)) 18px;
            transition:
              transform 0.2s ease-out,
              background-position 0.15s ease-out,
              background-image 0.15s ease-out;
          }

          .login-loader:before {
            content: "";
            position: absolute;
            width: 140%;
            height: 125px;
            left: -20%;
            top: 0;
            transform: translate(calc(var(--face-offset-x, 0px) * 0.4), calc(var(--face-offset-y, 0px) * 0.4))
              rotate(var(--face-rotate, 0deg));
            transform-origin: 50% 40%;
            background-image:
              radial-gradient(circle, #fff 48%, transparent 50%),
              radial-gradient(circle, #fff 48%, transparent 50%);
            background-repeat: no-repeat;
            background-size: 65px 65px;
            background-position: 0px 12px, 145px 12px;
            transition: transform 0.2s ease-out;
          }
        `}
      </style>
    </>
  );
};

export default Login;
