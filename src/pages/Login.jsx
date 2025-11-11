import { useCallback, useEffect, useRef, useState } from "react";

const SHAPE_CONFIGS = [
  {
    id: "primary",
    className: "login-loader login-loader--primary",
    wrapperClass: "w-full sm:w-auto flex-shrink-0",
    faceMax: 18,
    eyeMax: 5,
    rotationMax: 8,
    bodySkewMax: 6,
    layout: {
      translateX: -50,
      translateY: 0,
      scale: 0.92,
      zIndex: 1,
      opacity: 1,
      filter: "none",
    },
  },
  {
    id: "secondary",
    className: "login-loader login-loader--secondary",
    wrapperClass: "w-full sm:w-auto flex-shrink-0",
    faceMax: 16,
    eyeMax: 4.5,
    rotationMax: 7,
    bodySkewMax: 5,
    layout: {
      translateX: -20,
      translateY: 0,
      scale: 0.95,
      zIndex: 4,
      opacity: 1,
      filter: "none",
    },
  },
  {
    id: "tertiary",
    className: "login-loader login-loader--tertiary",
    wrapperClass: "w-full sm:w-auto flex-shrink-0",
    faceMax: 17,
    eyeMax: 5,
    rotationMax: 8,
    bodySkewMax: 6,
    layout: {
      translateX: 10,
      translateY: 0,
      scale: 0.93,
      zIndex: 2,
      opacity: 1,
      filter: "none",
    },
  },
  {
    id: "quaternary",
    className: "login-loader login-loader--quaternary",
    wrapperClass: "w-full sm:w-auto flex-shrink-0",
    faceMax: 15,
    eyeMax: 4,
    rotationMax: 6,
    bodySkewMax: 4,
    layout: {
      translateX: 40,
      translateY: 0,
      scale: 0.97,
      zIndex: 3,
      opacity: 1,
      filter: "none",
    },
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
        <div
          className="mx-auto flex w-full flex-col overflow-hidden rounded-3xl bg-white/60 shadow-lg backdrop-blur md:flex-row"
          style={{ maxWidth: "90rem" }}
        >
          <div
            className="flex w-full flex-1 items-center justify-center bg-white/10 p-8 text-center md:p-12 overflow-visible"
            style={{ minWidth: "0" }}
          >
            <div className="login-loader-stack">
              {SHAPE_CONFIGS.map((config, index) => {
                const offsets = shapeOffsets[index];
                const layout = config.layout ?? {};
                return (
                  <div
                    key={config.id}
                    className={`login-loader-stack__item ${config.wrapperClass}`}
                    style={{
                      "--layout-translate-x": `${layout.translateX ?? 0}px`,
                      "--layout-translate-y": `${layout.translateY ?? 0}px`,
                      "--layout-scale": layout.scale ?? 1,
                      "--layout-opacity": layout.opacity ?? 1,
                      "--layout-filter": layout.filter ?? "none",
                      "--layout-z": layout.zIndex ?? 1,
                    }}
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
          .login-loader-stack {
            position: relative;
            display: flex;
            width: 100%;
            max-width: clamp(600px, 70vw, 900px);
            align-items: flex-end;
            justify-content: center;
            padding: clamp(20px, 3.5vw, 34px) 0;
            gap: 0;
            border-radius: clamp(120px, 20vw, 260px);
            background: transparent;
            box-shadow: none;
            margin: 0 auto;
          }

          .login-loader-stack__item {
            position: relative;
            display: flex;
            align-items: flex-end;
            justify-content: center;
            margin-right: -60px;
            transform: translate(
                var(--layout-translate-x, 0px),
                var(--layout-translate-y, 0px)
              )
              scale(var(--layout-scale, 1));
            opacity: var(--layout-opacity, 1);
            filter: var(--layout-filter, none);
            transition:
              transform 0.4s ease,
              filter 0.35s ease,
              opacity 0.35s ease;
            z-index: var(--layout-z, 1);
          }

          .login-loader-stack__item:last-child {
            margin-right: 0;
          }

          @media (max-width: 768px) {
            .login-loader-stack {
              flex-wrap: wrap;
              justify-content: center;
              gap: clamp(32px, 8vw, 56px);
            }

            .login-loader-stack__item {
              transform: translate(0, 0) scale(0.92);
              opacity: 1;
              filter: none;
            }
          }

          .login-loader {
            --loader-width: clamp(85px, 8vw, 115px);
            --loader-height: clamp(130px, 14vw, 200px);
            --shell-color: #fff;
            --shell-shadow: none;
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
            width: 70px;
            height: 88px;
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
                to right,
                transparent 0%,
                rgba(var(--eyelid-color-rgb), var(--eye-lid-opacity, 0)) 10%,
                rgba(var(--eyelid-color-rgb), var(--eye-lid-opacity, 0)) 90%,
                transparent 100%
              ),
              linear-gradient(
                to right,
                transparent 0%,
                rgba(var(--eyelid-color-rgb), var(--eye-lid-opacity, 0)) 10%,
                rgba(var(--eyelid-color-rgb), var(--eye-lid-opacity, 0)) 90%,
                transparent 100%
              );
            background-repeat: no-repeat;
            background-size:
              12px 12px,
              12px 12px,
              8px 8px,
              30px 30px,
              9px 2px,
              35px 18px,
              50px 50px,
              50px 50px,
              14px 3px,
              14px 3px;
            background-position:
              calc(18px + var(--eye-offset-x, 0px)) calc(7px + var(--eye-offset-y, 0px)),
              calc(39px + var(--eye-offset-x, 0px)) calc(7px + var(--eye-offset-y, 0px)),
              25px 31px,
              50% 21px,
              50% 60px,
              50% 35px,
              50% 16px,
              50% 32px,
              calc(17px + var(--eye-offset-x, 0px)) calc(8px + var(--eye-offset-y, 0px)),
              calc(38px + var(--eye-offset-x, 0px)) calc(8px + var(--eye-offset-y, 0px));
            transition:
              transform 0.2s ease-out,
              background-position 0.15s ease-out,
              background-image 0.15s ease-out;
          }

          .login-loader:before {
            content: "";
            position: absolute;
            width: 140%;
            height: 88px;
            left: -20%;
            top: 0;
            transform: translate(calc(var(--face-offset-x, 0px) * 0.4), calc(var(--face-offset-y, 0px) * 0.4))
              rotate(var(--face-rotate, 0deg));
            transform-origin: 50% 40%;
            background-image:
              radial-gradient(circle, var(--ear-color) 48%, transparent 50%),
              radial-gradient(circle, var(--ear-color) 48%, transparent 50%);
            background-repeat: no-repeat;
            background-size: 46px 46px;
            background-position: 0px 8px, 102px 8px;
            transition: transform 0.2s ease-out;
          }

          .login-loader--primary {
            --loader-width: clamp(85px, 8vw, 115px);
            --loader-height: clamp(160px, 18vw, 240px);
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
            --loader-width: clamp(75px, 9vw, 135px);
            --loader-height: clamp(80px, 9vw, 120px);
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
            --loader-width: clamp(90px, 10vw, 145px);
            --loader-height: clamp(110px, 12vw, 160px);
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
            --loader-width: clamp(70px, 8vw, 125px);
            --loader-height: clamp(140px, 15vw, 200px);
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
