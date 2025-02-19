import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";

export default function Custom404() {
  const router = useRouter();
  const [ballPosition, setBallPosition] = useState({ x: 50, y: 50 }); // 핏몬의 위치
  const [bombPosition, setBombPosition] = useState({ x: 30, y: 30 }); // 폭탄의 위치
  const [buttonPosition, setButtonPosition] = useState({ x: 40, y: 40 }); // "메인으로 돌아가기" 버튼 위치
  const [showBomb, setShowBomb] = useState(false); // 폭탄 표시 여부
  const [speed, setSpeed] = useState(1.5); // 핏몬 이동 속도
  const [score, setScore] = useState(0); // 점수
  const gameAreaRef = useRef<HTMLDivElement>(null); // 게임 영역 참조

  useEffect(() => {
    const ballInterval = setInterval(() => {
      setBallPosition({
        x: Math.random() * 90 + 5,
        y: Math.random() * 90 + 5,
      });
      setSpeed((prev) => Math.max(1, prev - 0.05)); // 핏몬 속도 점진적으로 증가
    }, speed * 1000);

    return () => clearInterval(ballInterval); // 타이머 정리
  }, [speed]);

  useEffect(() => {
    const bombInterval = setInterval(() => {
      setBombPosition({
        x: Math.random() * 90 + 5,
        y: Math.random() * 90 + 5,
      });
      setShowBomb(true); // 폭탄 표시
      setTimeout(() => setShowBomb(false), 1500); // 1.5초 후 폭탄 숨김
    }, 3000);

    return () => clearInterval(bombInterval); // 타이머 정리
  }, []);

  useEffect(() => {
    const buttonInterval = setInterval(() => {
      setButtonPosition({
        x: Math.random() * 90 + 5,
        y: Math.random() * 90 + 5,
      });
    }, 400); // 버튼은 0.4초마다 이동

    return () => clearInterval(buttonInterval); // 타이머 정리
  }, []);

  useEffect(() => {
    if (score >= 10) {
      alert("축하합니다! 핏몬 10마리를 잡았습니다. 메인 페이지로 이동합니다.");
      router.push("/"); // 메인 페이지로 이동
    }
  }, [score, router]);

  const handleBallClick = () => {
    setScore((prev) => prev + 1); // 점수 1 증가
  };

  const handleBombClick = () => {
    setScore(0); // 점수 초기화
    alert("꽝! 점수가 초기화되었습니다."); // 경고 메시지
  };

  return (
    <div
      ref={gameAreaRef}
      className="relative w-full overflow-hidden"
      style={{
        height: "calc(100vh - 81px)", // Adjust game area height based on navigation height
      }}
    >
      {/* 텍스트 영역 */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center z-10 text-white"
        style={{
          textAlign: "center", // 텍스트 정렬
        }}
      >
        <h1 className="text-[80px] md:text-[120px] font-bold">PAGE NOT FOUND</h1>
        <p className="text-lg md:text-xl mt-4">찾으시는 페이지를 찾을 수 없습니다.</p>
        <p className="text-lg md:text-xl">
          메인으로 돌아가기 버튼을 잡아보시거나, 핏몬이 10마리를 잡아보십쇼.
        </p>
        <p className="mt-4 text-lg text-primary font-bold">미니게임: 핏몬이를 잡아라!</p>
        <p className="text-lg text-primary font-bold">점수: {score}</p>
      </div>

      {/* 핏몬 (점수 증가 요소) */}
      <div
        onClick={handleBallClick}
        className="absolute z-20 cursor-pointer"
        style={{
          width: "50px",
          height: "50px",
          backgroundImage: "url(/assets/image/fitmon.png)",
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          left: `${ballPosition.x}%`,
          top: `${ballPosition.y}%`,
          transform: "translate(-50%, -50%)",
        }}
      ></div>

      {/* 폭탄 (점수 초기화 요소) */}
      {showBomb && (
        <div
          onClick={handleBombClick}
          className="absolute z-20 cursor-pointer"
          style={{
            width: "50px",
            height: "50px",
            backgroundImage: "url(/assets/image/bomb.svg)",
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            left: `${bombPosition.x}%`,
            top: `${bombPosition.y}%`,
            transform: "translate(-50%, -50%)",
          }}
        ></div>
      )}

      {/* "메인으로 돌아가기" 버튼 */}
      <button
        onClick={() => router.push("/")}
        className="absolute z-30 bg-primary text-white px-4 py-2 rounded-lg font-bold"
        style={{
          left: `${buttonPosition.x}%`,
          top: `${buttonPosition.y}%`,
          transform: "translate(-50%, -50%)",
        }}
      >
        메인으로 돌아가기
      </button>
      
      {/* 스크롤 방지 */}
      <style jsx>{`
        html,
        body {
          margin: 0;
          padding: 0;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}

