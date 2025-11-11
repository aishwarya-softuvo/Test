import { useCallback, useEffect, useRef, useState } from "react";

const SHAPE_CONFIGS = [
  {
    id: "primary",
    className: "login-loader login-loader--primary",
    wrapperClass: "sm:col-span-1",
    faceMax: 18,
    eyeMax: 5,
    rotationMax: 8,
    bodySkewMax: 6,
  },
  {
    id: "secondary",
    className: "login-loader login-loader--secondary",
    wrapperClass: "sm:col-span-1",
    faceMax: 16,
    eyeMax: 4.5,
    rotationMax: 7,
    bodySkewMax: 5,
  },
  {
    id: "tertiary",
    className: "login-loader login-loader--tertiary",
    wrapperClass: "sm:col-span-1",
    faceMax: 17,
    eyeMax: 5,
    rotationMax: 8,
    bodySkewMax: 6,
  },
  {
    id: "quaternary",
    className: "login-loader login-loader--quaternary",
    wrapperClass: "sm:col-span-2",
    faceMax: 15,
    eyeMax: 4,
    rotationMax: 6,
    bodySkewMax: 4,
  },
];

const createNeutralOffsets = () => ({
  face: { x: 0, y: 0, rotate: 0 },
  eyes: { x: 0, y: 0 },
  bodySkew: 0,
});

const getNeutralOffsetsArray = () =>
  SHAPE_CONFIGS.map(() => createNeutralOffsets());

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isPasswordPointerInside, setIsPasswordPointerInside] = useState(false);
  const [isPasswordTyping, setIsPasswordTyping] = useState(false);
  const [shapeOffsets, setShapeOffsets] = useState(getNeutralOffsetsArray);
  const loaderRefs = useRef([]);
  const typingTimeoutRef = useRef(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetShapeOffsets = useCallback(() => {
    setShapeOffsets(getNeutralOffsetsArray());
  }, []);

  useEffect(() => {
    const handleMouseMove = (event) => {
      if (isPasswordPointerInside || isPasswordTyping) {
        return;
      }

      const updatedOffsets = SHAPE_CONFIGS.map((config, index) => {
        const element = loaderRefs.current[index];
        if (!element) {
          return createNeutralOffsets();
        }

        const bounds = element.getBoundingClientRect();
        const centerX = bounds.left + bounds.width / 2;
        const centerY = bounds.top + bounds.height / 2;

        const deltaX = event.clientX - centerX;
        const deltaY = event.clientY - centerY;

        const normalizedX = Math.max(Math.min(deltaX / 150, 1), -1);
        const normalizedY = Math.max(Math.min(deltaY / 150, 1), -1);

        const faceX = config.faceMax * normalizedX;
        const faceY = config.faceMax * normalizedY;
        const eyesX = config.eyeMax * normalizedX;
        const eyesY = config.eyeMax * normalizedY;
        const rotate = config.rotationMax * normalizedX;
        const bodySkewValue = config.bodySkewMax * normalizedX * -1;

        return {
          face: { x: faceX, y: faceY, rotate },
          eyes: { x: eyesX, y: eyesY },
          bodySkew: bodySkewValue,
        };
      });

      setShapeOffsets(updatedOffsets);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isPasswordPointerInside, isPasswordTyping]);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isPasswordPointerInside && !isPasswordTyping) {
      return;
    }

    resetShapeOffsets();
  }, [isPasswordPointerInside, isPasswordTyping, resetShapeOffsets]);

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Login form submitted:", formData);
  };

  const handlePointerEnter = () => {
    setIsPasswordPointerInside(true);
    resetShapeOffsets();
  };

  const handlePointerLeave = () => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    setIsPasswordPointerInside(false);
    setIsPasswordTyping(false);
    resetShapeOffsets();
  };

  return (
    <>
      <section className="flex min-h-[calc(100vh-8rem)] w-full flex-1 flex-col justify-center bg-slate-100/70 px-0 py-16">
        <div className="mx-auto flex w-full max-w-6xl flex-col overflow-hidden rounded-3xl bg-white/60 shadow-lg backdrop-blur md:flex-row">
          <div className="flex w-full flex-1 items-center justify-center bg-white/10 p-8 text-center md:p-12">
            <div className="grid w-full max-w-xl items-end gap-8 sm:grid-cols-2">
              {SHAPE_CONFIGS.map((config, index) => {
                const offsets = shapeOffsets[index];
                return (
                  <div
                    key={config.id}
                    className={`relative flex items-end justify-center ${config.wrapperClass}`}
                  >
                    <div
                      ref={(element) => {
                        loaderRefs.current[index] = element;
                      }}
                      className={config.className}
                      style={{
                        "--face-offset-x": `${offsets.face.x}px`,
                        "--face-offset-y": `${offsets.face.y}px`,
                        "--face-rotate": `${offsets.face.rotate}deg`,
                        "--eye-offset-x": `${offsets.eyes.x}px`,
                        "--eye-offset-y": `${offsets.eyes.y}px`,
                        "--body-skew": `${offsets.bodySkew}deg`,
                        "--eye-visible":
                          isPasswordPointerInside || isPasswordTyping ? 0 : 1,
                        "--eye-lid-opacity":
                          isPasswordPointerInside || isPasswordTyping ? 1 : 0,
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex w-full flex-1 items-center justify-center bg-white/40 p-8 md:p-12">
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
                    onKeyDown={() => {
                      if (typingTimeoutRef.current) {
                        clearTimeout(typingTimeoutRef.current);
                      }
                      setIsPasswordTyping(true);
                    }}
                    onKeyUp={() => {
                      if (typingTimeoutRef.current) {
                        clearTimeout(typingTimeoutRef.current);
                      }
                      typingTimeoutRef.current = setTimeout(() => {
                        setIsPasswordTyping(false);
                      }, 1000);
                    }}
                    onInput={() => {
                      if (typingTimeoutRef.current) {
                        clearTimeout(typingTimeoutRef.current);
                      }
                      setIsPasswordTyping(true);
                    }}
                    onFocus={handlePointerEnter}
                    onBlur={handlePointerLeave}
                    onMouseEnter={handlePointerEnter}
                    onMouseLeave={handlePointerLeave}
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
            --loader-width: clamp(160px, 15vw, 220px);
            --loader-height: clamp(185px, 20vw, 280px);
            --shell-color: #fff;
            --shell-shadow: 0 20px 45px -20px rgba(15, 23, 42, 0.35);
            --face-color: #cfecf9;
            --nose-color: #000;
            --mouth-color: #000;
            --eye-highlight: #fff;
            --eyelid-color-rgb: 15, 23, 42;
            --ear-color: #fff;
            --shell-radius: 100px 100px 0 0;
            width: var(--loader-width);
            height: var(--loader-height);
            position: relative;
            background: var(--shell-color);
            border-radius: var(--shell-radius);
            box-shadow: var(--shell-shadow);
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
              radial-gradient(circle, var(--eye-highlight) 30%, transparent 45%),
              radial-gradient(circle, var(--nose-color) 48%, transparent 51%),
              linear-gradient(var(--mouth-color) 20px, transparent 0),
              linear-gradient(var(--face-color) 60px, transparent 0),
              radial-gradient(circle, var(--face-color) 50%, transparent 51%),
              radial-gradient(circle, var(--face-color) 50%, transparent 51%),
              linear-gradient(
                to bottom,
                transparent 46%,
                rgba(var(--eyelid-color-rgb), var(--eye-lid-opacity, 0)) 46%,
                rgba(var(--eyelid-color-rgb), var(--eye-lid-opacity, 0)) 54%,
                transparent 54%
              ),
              linear-gradient(
                to bottom,
                transparent 46%,
                rgba(var(--eyelid-color-rgb), var(--eye-lid-opacity, 0)) 46%,
                rgba(var(--eyelid-color-rgb), var(--eye-lid-opacity, 0)) 54%,
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
              radial-gradient(circle, var(--ear-color) 48%, transparent 50%),
              radial-gradient(circle, var(--ear-color) 48%, transparent 50%);
            background-repeat: no-repeat;
            background-size: 65px 65px;
            background-position: 0px 12px, 145px 12px;
            transition: transform 0.2s ease-out;
          }

          .login-loader--primary {
            --loader-width: clamp(160px, 15vw, 220px);
            --loader-height: clamp(185px, 20vw, 280px);
            --shell-color: #fff;
            --shell-shadow: 0 20px 45px -20px rgba(15, 23, 42, 0.35);
            --face-color: #cfecf9;
            --nose-color: #000;
            --mouth-color: #000;
            --eye-highlight: #fff;
            --eyelid-color-rgb: 15, 23, 42;
            --ear-color: #fff;
            --shell-radius: 110px 110px 30px 30px;
          }

          .login-loader--secondary {
            --loader-width: clamp(150px, 18vw, 260px);
            --loader-height: clamp(140px, 16vw, 220px);
            --shell-color: #fff7ed;
            --shell-shadow: 0 18px 40px -22px rgba(217, 119, 6, 0.25);
            --face-color: #fed7aa;
            --nose-color: #9a3412;
            --mouth-color: #9a3412;
            --eye-highlight: #fff5e1;
            --eyelid-color-rgb: 157, 85, 39;
            --ear-color: #ffedd5;
            --shell-radius: 42px;
          }

          .login-loader--tertiary {
            --loader-width: clamp(180px, 19vw, 280px);
            --loader-height: clamp(180px, 19vw, 280px);
            --shell-color: #eff6ff;
            --shell-shadow: 0 18px 40px -22px rgba(37, 99, 235, 0.28);
            --face-color: #bfdbfe;
            --nose-color: #1d4ed8;
            --mouth-color: #1d4ed8;
            --eye-highlight: #e0f2fe;
            --eyelid-color-rgb: 29, 78, 216;
            --ear-color: #dbeafe;
            --shell-radius: 50%;
          }

          .login-loader--quaternary {
            --loader-width: clamp(140px, 16vw, 240px);
            --loader-height: clamp(210px, 23vw, 320px);
            --shell-color: #f5f3ff;
            --shell-shadow: 0 18px 40px -22px rgba(109, 40, 217, 0.25);
            --face-color: #ddd6fe;
            --nose-color: #6b21a8;
            --mouth-color: #6b21a8;
            --eye-highlight: #ede9fe;
            --eyelid-color-rgb: 91, 33, 182;
            --ear-color: #ede9fe;
            --shell-radius: 24px 24px 80px 80px;
          }
        `}
      </style>
    </>
  );
};

export default Login;
