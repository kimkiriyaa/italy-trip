import React, { useState } from 'react';
import { User } from 'firebase/auth';
import { DriveTravelFile } from '../types/travel';
import {
  Cloud,
  FileText,
  FileCode,
  Folder,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  Edit3,
  Check,
  RotateCcw,
} from 'lucide-react';

interface DriveHubViewProps {
  user: User | null;
  onLogin: () => void;
  driveFiles: DriveTravelFile[];
  activeFile: DriveTravelFile | null;
  onSelectFile: (file: DriveTravelFile) => void;
  isLoading: boolean;
  onRefresh: () => void;
  parsedFileText?: string;
  onReparseCustomText?: (text: string) => void;
  onResetToSample?: () => void;
}

export const DriveHubView: React.FC<DriveHubViewProps> = ({
  user,
  onLogin,
  driveFiles,
  activeFile,
  onSelectFile,
  isLoading,
  onRefresh,
  parsedFileText = '',
  onReparseCustomText,
  onResetToSample,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(parsedFileText);
  const [saveToast, setSaveToast] = useState(false);

  // Sync editedText when parsedFileText changes
  React.useEffect(() => {
    setEditedText(parsedFileText);
  }, [parsedFileText]);

  const handleApplyText = () => {
    if (onReparseCustomText && editedText.trim()) {
      onReparseCustomText(editedText);
      setSaveToast(true);
      setTimeout(() => setSaveToast(false), 3000);
      setIsEditing(false);
    }
  };

  const getMimeIcon = (mimeType: string) => {
    if (mimeType.includes('document')) {
      return <FileText className="w-5 h-5 text-blue-600" />;
    } else if (mimeType.includes('presentation')) {
      return <FileCode className="w-5 h-5 text-amber-600" />;
    }
    return <Folder className="w-5 h-5 text-stone-600" />;
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 flex items-center gap-1">
              <Cloud className="w-3.5 h-3.5" />
              Google Drive 문서 실시간 분석 & 동기화
            </span>
            {user && (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                드라이브 연동됨
              </span>
            )}
          </div>
          <h2 className="text-2xl font-black text-stone-900">내 드라이브 파일 일정 검증 & 분석 허브</h2>
          <p className="text-xs text-stone-600 mt-1 max-w-xl">
            구글 드라이브의 실제 여행 파일 내용을 읽어 앱의 날짜별 일정과 예약 바우처로 자동 변환합니다. 파일 내용이 일치하지 않는 경우 아래 파일 목록에서 원하는 문서를 선택하거나 원문 텍스트를 즉시 검토하세요.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {onResetToSample && (
            <button
              onClick={onResetToSample}
              className="px-3.5 py-2 rounded-2xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="8박 9일 기본 추천 일정으로 복원"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>기본 추천 일정 복원</span>
            </button>
          )}

          {user ? (
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="px-4 py-2 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>파일 목록 새로고침</span>
            </button>
          ) : (
            <button
              onClick={onLogin}
              className="px-5 py-2.5 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold flex items-center gap-2 shadow-md transition-all active:scale-95"
            >
              <Cloud className="w-4 h-4 text-amber-400" />
              <span>Google 계정 로그인하여 드라이브 연결</span>
            </button>
          )}
        </div>
      </div>

      {/* Currently Active File Details & Text Inspection */}
      <div className="bg-amber-50/80 border-2 border-amber-300 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-white shadow-xs">
              {activeFile ? getMimeIcon(activeFile.mimeType) : <Sparkles className="w-5 h-5 text-amber-500" />}
            </div>
            <div>
              <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">
                {activeFile ? '현재 적용 중인 구글 드라이브 파일' : '기본 내장 이탈리아 일정 적용 중'}
              </span>
              <h3 className="text-lg font-black text-stone-900">
                {activeFile ? activeFile.name : '2026 이탈리아 로맨틱 & 클래식 8박 9일 그랜드 투어'}
              </h3>
              {activeFile && (
                <span className="text-xs text-stone-500 font-mono">
                  최근 수정 일시: {new Date(activeFile.modifiedTime).toLocaleString()}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {activeFile?.webViewLink && (
              <a
                href={activeFile.webViewLink}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-xl bg-white text-stone-800 border border-stone-300 text-xs font-bold hover:bg-stone-50 transition-colors flex items-center gap-1.5 shadow-2xs"
              >
                <span>드라이브 원본 열기</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditing ? '미리보기 모드' : '원문 텍스트 검토 & 편집'}</span>
            </button>
          </div>
        </div>

        {/* Text Inspection / Custom text re-parsing */}
        <div className="bg-white p-4 rounded-2xl border border-amber-200 space-y-2">
          <div className="flex items-center justify-between">
            <div className="font-bold text-stone-900 text-xs flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>
                {isEditing ? '파일 텍스트 직접 편집 & 분석 적용' : '파일에서 읽어온 본문 텍스트'}
              </span>
            </div>
            {saveToast && (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                분석 완료 및 일정에 반영되었습니다!
              </span>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-3">
              <p className="text-[11px] text-stone-500">
                구글 드라이브 문서에 적힌 일정이나 예약 내역을 복사/붙여넣기하거나 수정한 뒤 아래 [일정에 바로 분석 적용] 버튼을 누르면 즉시 앱의 일정과 예약 목록에 반영됩니다.
              </p>
              <textarea
                rows={8}
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                placeholder="Day 1 10/15 로마 도착, 항공편 KE931, 호텔 예약번호..."
                className="w-full p-3 border border-stone-300 rounded-xl font-mono text-xs focus:ring-2 focus:ring-stone-900 outline-none leading-relaxed"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setEditedText(parsedFileText);
                    setIsEditing(false);
                  }}
                  className="px-3.5 py-1.5 rounded-xl text-stone-600 hover:bg-stone-100 text-xs font-bold"
                >
                  취소
                </button>
                <button
                  onClick={handleApplyText}
                  className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold shadow-md transition-colors flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>일정에 바로 분석 적용</span>
                </button>
              </div>
            </div>
          ) : (
            <pre className="whitespace-pre-wrap leading-relaxed text-[11px] text-stone-600 font-mono max-h-48 overflow-y-auto bg-stone-50 p-3 rounded-xl border border-stone-200">
              {parsedFileText || '(선택된 파일에서 추출된 텍스트가 없습니다. 아래 드라이브 파일 목록에서 문서를 선택해주세요.)'}
            </pre>
          )}
        </div>
      </div>

      {/* Files List in Drive */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-stone-900 flex items-center gap-2">
            <span>내 구글 드라이브 파일 목록</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-stone-100 text-stone-600">
              총 {driveFiles.length}건
            </span>
          </h3>
          <span className="text-xs text-stone-500">
            원하는 파일을 클릭하면 즉시 해당 파일의 내용으로 일정이 전환됩니다.
          </span>
        </div>

        {driveFiles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {driveFiles.map((f) => {
              const isSelected = activeFile?.id === f.id;
              return (
                <div
                  key={f.id}
                  onClick={() => onSelectFile(f)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-400 shadow-sm'
                      : 'bg-white hover:bg-stone-50 border-stone-200 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-xl bg-stone-100 shrink-0">
                      {getMimeIcon(f.mimeType)}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-stone-900 truncate">{f.name}</h4>
                      <p className="text-[11px] text-stone-500 mt-0.5">
                        수정 일시: {new Date(f.modifiedTime).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectFile(f)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-amber-400 text-stone-950 font-black'
                        : 'bg-stone-900 hover:bg-stone-800 text-white'
                    }`}
                  >
                    {isSelected ? '적용 중' : '이 파일로 일정 불러오기'}
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center bg-white rounded-3xl border border-stone-200 space-y-3">
            <Cloud className="w-10 h-10 text-stone-300 mx-auto" />
            <h4 className="text-sm font-bold text-stone-700">구글 드라이브에서 파일 목록을 가져오세요</h4>
            <p className="text-xs text-stone-500 max-w-md mx-auto leading-relaxed">
              Google 로그인 후 드라이브에 저장된 여행 문서(Docs, Slides, Sheets)를 가져오면 내 실제 일정과 예약 내역이 화면에 그대로 표시됩니다.
            </p>
            {!user && (
              <button
                onClick={onLogin}
                className="mt-2 px-5 py-2.5 rounded-2xl bg-stone-900 text-white text-xs font-bold hover:bg-stone-800 transition-colors shadow-sm"
              >
                Google 로그인하고 드라이브 연결하기
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
