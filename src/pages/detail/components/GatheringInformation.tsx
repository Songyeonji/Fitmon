import Image from 'next/image';
import TagList from './tag';
import { GatheringItem } from '@/types';
import Popover from '@/components/common/Popover';

export default function GatheringInformation({
  information,
}: {
  information: GatheringItem;
}) {
  if (!information) {
    return <div>{'Loading..'}</div>;
  }

  const popoverItems = [
    {
      id: 'edit',
      label: '수정하기',
      onClick: () => {
        console.log('수정하기 버튼 클릭');
      },
    },
    { id: 'delete', label: '삭제하기' },
  ];
  return (
    <div id="gathering-information" className="w-full">
      <div id="type-information">
        <div className="flex mt-20 gap-[10px]">
          <p className="text-lg font-semibold">
            {information.gatheringMainType ?? ''}
          </p>
          <Image
            src="/assets/image/arrow-right.svg"
            alt="arrow"
            width={12}
            height={12}
          />
          <p className="text-primary text-lg font-semibold">
            {information.gatheringSubType}
          </p>
        </div>
      </div>
      <div id="image-and-description" className="flex mt-[30px]">
        <Image
          width={280}
          height={300}
          alt="gathering-image"
          src="/assets/image/fitmon.png"
          className="rounded-[20px] mr-[50px] w-[280px] h-[300px] object-cover"
        />
        <div id="detail-information" className=" w-full">
          <div className="flex justify-between">
            {' '}
            <h3 className="text-[1.75rem] font-semibold">
              {information.gatheringTitle}
            </h3>
            {information.captainStatus && (
              <Popover items={popoverItems} type="setting" />
              // <Image
              //   src="/assets/image/setting.svg"
              //   alt="setting"
              //   width={28}
              //   height={28}
              // />
            )}
          </div>

          <p className="text-[1.125rem] text-dark-700 mt-[3px]">
            {information.gatheringDescription}
          </p>
          <div id="tags" className="mt-5">
            <TagList tagList={information.gatheringTags} />
          </div>
          <div
            id="range-and-place"
            className="w-full mt-[25px] py-[30px] bg-dark-200 rounded-[20px]"
          >
            <div id="range" className="flex items-center mb-[8px]">
              <Image
                src="/assets/image/time.svg"
                width={14}
                height={14}
                alt="time"
                className="ml-[25px] mr-2"
              />
              <h1 className="font-semibold text-lg">{'모임 기간'}</h1>
              <p className="bg-dark-500 h-[12px] w-[1px] mx-[15px]"></p>{' '}
              <p className="text-lg">{`${information.gatheringStartDate}~${information.gatheringEndDate}`}</p>
            </div>
            <div id="place" className="flex items-center">
              <Image
                src="/assets/image/place.svg"
                width={14}
                height={14}
                alt="place"
                className="ml-[25px] mr-2"
              />
              <h1 className="font-semibold text-lg">{'모임 장소'}</h1>
              <p className="bg-dark-500 h-[12px] w-[1px] mx-[15px]"></p>
              <p className="text-lg">{`${information.gatheringSi} ${information.gatheringGu}`}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
