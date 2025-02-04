import { useState } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import CardList from '@/components/card/gathering/CardList';
import Button from '@/components/common/Button';
import Tab from '@/components/common/Tab';
import SubTag from '@/components/tag/SubTag';
import ListChallenge from '@/pages/main/components/ListChallenge';
import FilterModal from './main/components/FilterModal';
import CreateGathering from './main/components/CreateGatheringModal';
import Alert from '@/components/dialog/Alert';
import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
  DehydratedState,
} from '@tanstack/react-query';
import {
  prefetchGatheringList,
  useGatheringListQuery,
} from '@/pages/main/service/gatheringService';
import { GatheringListParams } from '@/types';
import useMemberStore from '@/stores/useMemberStore';
import Image from 'next/image';
import {
  LISTPAGE_MAINTYPE,
  LISTPAGE_SUBTYPE,
  MainType,
} from '@/constants/MainList';

interface HomeProps {
  dehydratedState: DehydratedState;
}

export const getServerSideProps: GetServerSideProps = async () => {
  const queryClient = new QueryClient();
  await prefetchGatheringList(queryClient, {
    mainType: '',
    subType: '',
    mainLocation: '',
    subLocation: '',
    searchDate: '',
    sortBy: 'deadline',
    sortDirection: 'ASC',
  });

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export default function Home({ dehydratedState }: HomeProps) {
  const [filters, setFilters] = useState<GatheringListParams>({
    mainType: '전체',
    subType: '전체',
    mainLocation: '',
    subLocation: '',
    searchDate: '',
    sortBy: 'deadline',
    sortDirection: 'ASC',
  });

  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const { isLogin } = useMemberStore();
  const router = useRouter();

  const queryResults = useGatheringListQuery(filters);

  const handleApplyFilters = (newFilters: GatheringListParams) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  // ✅ 모임 만들기 버튼 핸들러
  const handleCreateButton = () => {
    if (isLogin) {
      setShowCreateModal(true);
    } else {
      setShowAlert(true);
    }
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8 pt-[30px] md:pt-[50px] lg:pt-20">
      <h2 className="text-xl md:text-[1.75rem] font-semibold pb-5 md:pb-[30px]">
        지금 핫한 챌린지 🔥
      </h2>

      <div className="overflow-hidden">
        <ListChallenge />
      </div>

      {/* 메인 탭 */}
      <div className="w-full mt-[30px] md:mt-[50px] lg:mt-20">
        <Tab
          items={LISTPAGE_MAINTYPE}
          currentTab={filters.mainType ?? ''}
          onTabChange={(newTab) => {
            console.log('🚀 탭 변경됨:', newTab);
            setFilters((prev) => ({
              ...prev,
              mainType: newTab,
              subType: '전체',
            }));
          }}
        />

        {/* 모바일/태블릿용 고정 버튼 */}
        <div className="lg:hidden fixed right-6 bottom-10 z-50">
          <Button
            style="custom"
            name="모임 만들기"
            className="text-base h-9 w-[126px]"
            handleButtonClick={handleCreateButton}
          />
        </div>
      </div>

      <div className="flex justify-end items-center my-5 lg:my-[35px]">
        {filters.mainType !== '전체' && (
          <SubTag
            tags={LISTPAGE_SUBTYPE[filters.mainType as MainType] ?? []}
            currentTag={filters.subType ?? ''}
            onTagChange={(newTag) =>
              setFilters((prev) => ({ ...prev, subType: newTag }))
            }
            className="flex w-full justify-start"
          />
        )}

        {/* 필터 버튼 */}
        <div
          className="min-w-20 flex gap-2.5 text-right"
          onClick={() => setShowFilterModal(true)}
        >
          정렬
          <Image
            src={'/assets/image/filter.svg'}
            alt="필터 아이콘"
            width={20}
            height={20}
          />
        </div>
      </div>

      {/* 필터 모달 */}
      {showFilterModal && (
        <FilterModal
          setShowFilterModal={() => setShowFilterModal(false)}
          filters={filters}
          setFilters={handleApplyFilters}
        />
      )}

      {/* 모임 만들기 모달 ✅ 유지 */}
      {showCreateModal && (
        <CreateGathering setShowCreateModal={() => setShowCreateModal(false)} />
      )}

      {/* 카드 리스트 */}
      <div className="pb-20">
        <HydrationBoundary state={dehydratedState}>
          <CardList filters={filters} />
        </HydrationBoundary>
      </div>

      {/* 더 보기 버튼 */}
      <div className="text-center mt-5">
        {queryResults.hasNextPage && (
          <Button
            style="custom"
            name="더 보기"
            className="text-base h-9 w-[126px]"
            handleButtonClick={() => queryResults.fetchNextPage()}
          />
        )}
      </div>

      {/* 알럿 컴포넌트 */}
      {showAlert && (
        <Alert
          isOpen={showAlert}
          type="confirm"
          message="로그인이 필요합니다."
          onConfirm={() => {
            setShowAlert(false);
            router.push('/login');
          }}
          onCancel={() => setShowAlert(false)}
        />
      )}
    </div>
  );
}
