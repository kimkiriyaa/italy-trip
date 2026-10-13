import React, { useState } from 'react';
import { DriveTravelFile } from '../types/travel';
import {
  X,
  FileText,
  FileCode,
  Folder,
  RefreshCw,
  ExternalLink,
  Check,
  Search,
  Sparkles,
  Cloud,
} from 'lucide-react';

interface DrivePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  files: DriveTravelFile[];
  activeFileId: string | null;
  onSelectFile: (file: DriveTravelFile) => void;
  isLoading: boolean;
  onRefresh: () => void;
}

export const DrivePickerModal: React.FC<DrivePickerModalProps> = ({
  isOpen,
  onClose,
  files,
  activeFileId,
  onSelectFile,
  isLoading,
  onRefresh,
}) => {
  const [filterQuery, setFilterQuery] = useState('');

  if (!isOpen) return null;

  const filtered = files.filter((f) =>
    f.name.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const getMimeIcon = (mimeType: string) => {
    if (mimeType.includes('document')) {
      return <FileText className="w-5 h-5 text-blue-600" />;
    } else if (mimeType.includes('presentation')) {
      return <FileCode className="w-5 h-5 text-amber-600" />;
    } else if (mimeType.includes('pdf')) {
      return <FileText className="w-5 h-5 text-rose-600" />;
    }
    return <Folder className="w-5 h-5 text-stone-600" />;
  };

  const getMimeLabel = (mimeType: string) => {
    if (mimeType.includes('document')) return 'Google Docs 문서';
    if (mimeType.includes('presentation')) return 'Google Slides 프레젠테이션';
    if (mimeType.includes('pdf')) return 'PDF 문서';
    return '드라이브 파일';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="p-6 bg-stone-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-white/10 backdrop-blur-md">
              <Cloud className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight">구글 드라이브 여행 일정 문서 선택</h3>
              <p className="text-xs text-stone-400">
                연결된 드라이브에서 가장 최근의 이탈리아 여행 일정을 선택하여 앱에 불러옵니다.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-stone-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Refresh bar */}
        <div className="p-4 bg-stone-50 border-b border-stone-200 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="문서 제목으로 검색 (예: 이탈리아, Italy, 여행)..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-stone-300 rounded-xl text-xs focus:ring-2 focus:ring-stone-900 outline-none"
            />
          </div>
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-stone-100 border border-stone-300 text-stone-700 text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 disabled:opacity-50"
            title="드라이브 다시 검색"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>새로고침</span>
          </button>
        </div>

        {/* File List */}
        <div className="p-4 overflow-y-auto space-y-2 flex-1">
          {isLoading ? (
            <div className="py-16 text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-amber-600 animate-spin mx-auto" />
              <p className="text-xs text-stone-600 font-medium">
                구글 드라이브에서 여행 일정 문서를 검색하고 있습니다...
              </p>
            </div>
          ) : filtered.length > 0 ? (
            filtered.map((file) => {
              const isActive = activeFileId === file.id;
              return (
                <div
                  key={file.id}
                  onClick={() => onSelectFile(file)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                    isActive
                      ? 'bg-amber-50/70 border-amber-300 ring-2 ring-amber-400 shadow-sm'
                      : 'bg-white hover:bg-stone-50 border-stone-200'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="p-2.5 rounded-xl bg-stone-100 shrink-0">
                      {getMimeIcon(file.mimeType)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-stone-900 truncate">{file.name}</h4>
                        {isActive && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-amber-400 text-stone-950 shrink-0">
                            현재 적용됨
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-stone-500 mt-0.5">
                        <span>{getMimeLabel(file.mimeType)}</span>
                        <span>•</span>
                        <span>최근 수정: {new Date(file.modifiedTime).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {file.webViewLink && (
                      <a
                        href={file.webViewLink}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
                        title="Google Drive 웹에서 열기"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                    <button
                      onClick={() => onSelectFile(file)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                        isActive
                          ? 'bg-amber-400 text-stone-950'
                          : 'bg-stone-900 hover:bg-stone-800 text-white'
                      }`}
                    >
                      {isActive ? '적용 중' : '불러오기'}
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center space-y-2">
              <FileText className="w-10 h-10 text-stone-300 mx-auto" />
              <h4 className="text-sm font-bold text-stone-700">검색된 드라이브 문서가 없습니다</h4>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                구글 드라이브에 '이탈리아' 또는 '여행' 키워드가 들어간 문서가 없다면, 기본 제공되는 최신 8박 9일 추천 일정이 바로 화면에 표시됩니다.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-100 border-t border-stone-200 flex items-center justify-between">
          <span className="text-xs text-stone-500">
            총 {files.length}개의 구글 드라이브 파일 탐색됨
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-stone-900 text-white rounded-xl text-xs font-semibold hover:bg-stone-800 transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
