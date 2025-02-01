import { EVENT_TYPES, getEventColor } from '@/pages/mypage/service/myCalendar';
import Image from 'next/image';

interface ColorLegendProps {
  eventTypes: typeof EVENT_TYPES;
  getColor: (type: string) => string;
}

export function ColorLegend({ eventTypes, getColor }: ColorLegendProps) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      {eventTypes.map((type) => (
        <div key={type} className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: getColor(type) }}
          />
          <span className="text-xs text-white">{type}</span>
        </div>
      ))}
      <div className="flex items-center gap-2 ml-4">
        <Image
          src="/assets/image/crown.svg"
          alt="Host"
          width={12}
          height={12}
        />
        <span className="text-xs text-white">주최자</span>
      </div>
    </div>
  );
}