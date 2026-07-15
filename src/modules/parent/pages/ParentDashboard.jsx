// src/modules/parent/pages/ParentDashboard.jsx

import { useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { gsap } from "gsap";

import {
  fetchProfile,
  fetchParentLinks,
  fetchAttendance,
  fetchGrades,
  fetchEvents,
} from "../../../store/parentThunks";
import ChildSelector from "../components/ChildSelector";
import AttendanceSummaryCard from "../components/AttendenceSummaryCard";
import GradeSummaryCard from "../components/GradeSummaryCard";
import ActiveEventsCard from "../components/ActiveEventsCard";

const ParentDashboard = () => {
  const dispatch = useDispatch();

  const containerRef = useRef(null);
  const bannerRef = useRef(null);
  const greetingRef = useRef(null);
  const waveRef = useRef(null);
  const subtitleRef = useRef(null);
  const todayRef = useRef(null);
  const animationRef = useRef(null);
  const selectorRef = useRef(null);
  const cardsRef = useRef(null);

  useEffect(() => {
    dispatch(fetchProfile());
    dispatch(fetchParentLinks());
    dispatch(fetchAttendance());
    dispatch(fetchGrades());
    dispatch(fetchEvents());
  }, [dispatch]);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";

    return "Good Evening";
  }, []);

  const today = useMemo(() => {
    return new Date().toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }, []);

  const { profile } = useSelector((state) => state.parent);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        bannerRef.current,
        { opacity: 0, y: 24, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.7 }
      )
        .fromTo(
          greetingRef.current,
          { opacity: 0, x: -20 },
          { opacity: 1, x: 0, duration: 0.5 },
          "-=0.35"
        )
        .fromTo(
          waveRef.current,
          { opacity: 0, scale: 0, rotate: -30 },
          { opacity: 1, scale: 1, rotate: 0, duration: 0.5, ease: "back.out(2.5)" },
          "-=0.25"
        )
        .fromTo(
          subtitleRef.current,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.5 },
          "-=0.2"
        )
        .fromTo(
          todayRef.current,
          { opacity: 0, y: 12, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.5 },
          "-=0.3"
        )
        .fromTo(
          animationRef.current,
          { opacity: 0, scale: 0.7, rotate: 8 },
          { opacity: 1, scale: 1, rotate: 0, duration: 0.7, ease: "back.out(1.7)" },
          "-=0.6"
        )
        .fromTo(
          selectorRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.55 },
          "-=0.3"
        )
        .fromTo(
          cardsRef.current,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.6 },
          "-=0.3"
        );

      // subtle idle float on the lottie animation
      gsap.to(animationRef.current, {
        y: -8,
        duration: 2.2,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: 1.2,
      });

      // periodic wave wiggle
      gsap.to(waveRef.current, {
        rotate: 14,
        duration: 0.15,
        ease: "power1.inOut",
        repeat: 5,
        yoyo: true,
        repeatDelay: 3.5,
        delay: 1.5,
        transformOrigin: "70% 70%",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="space-y-8">
      {/* =======================================================
          Header
      ======================================================= */}

      <div
        ref={bannerRef}
        className="overflow-hidden rounded-2xl bg-gradient-to-r from-parent-primary to-parent-hover p-6 text-white shadow-lg"
      >
        <div className="flex flex-col-reverse items-center gap-6 lg:flex-row lg:justify-between">
          {/* Left Side */}
          <div className="flex-1 text-center lg:text-left">
            <div className="flex items-center justify-center gap-2 lg:justify-start">
              <h1 ref={greetingRef} className="text-3xl font-bold leading-tight">
                {greeting}, {profile?.full_name?.split(" ")[0] || "Parent"}
              </h1>

              <div ref={waveRef} className="h-12 w-12 shrink-0">
                <DotLottieReact
                  src="/animations/hand wave.lottie"
                  autoplay
                  loop
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                />
              </div>
            </div>

            <p ref={subtitleRef} className="mt-3 max-w-xl text-white/90">
              Here's an overview of your child's academic progress,
              attendance, grades, and upcoming school activities.
            </p>

            <div
              ref={todayRef}
              className="mt-6 inline-block rounded-xl bg-white/10 px-5 py-3 backdrop-blur"
            >
              <p className="text-sm text-white/80">Today</p>
              <p className="font-semibold">{today}</p>
            </div>
          </div>

          {/* Right Animation */}
          <div
            ref={animationRef}
            className="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 flex-shrink-0"
          >
            <DotLottieReact
              src="../../../../public/animations/register.lottie"
              autoplay
              loop
              style={{
                width: "100%",
                height: "100%",
              }}
            />
          </div>
        </div>
      </div>

      {/* =======================================================
          Child Selector
      ======================================================= */}

      <div ref={selectorRef}>
        <ChildSelector />
      </div>

      {/* =======================================================
          Dashboard Cards
      ======================================================= */}

      <div ref={cardsRef} className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <AttendanceSummaryCard />
        <GradeSummaryCard />
        <ActiveEventsCard />
      </div>
    </div>
  );
};

export default ParentDashboard;