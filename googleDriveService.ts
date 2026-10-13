import { DriveTravelFile } from '../types/travel';

export interface DriveFetchResult {
  file: DriveTravelFile;
  rawText: string;
  sourceType: 'doc' | 'slides' | 'sheets' | 'text' | 'export';
}

/**
 * Searches user's Google Drive for files related to Italy travel or recent travel plans.
 * Fetches both keyword-matched files AND all recently modified Google Docs, Slides, and Sheets.
 */
export async function searchTravelFilesInDrive(accessToken: string): Promise<DriveTravelFile[]> {
  try {
    // 1. Fetch recently modified Docs, Presentations, Spreadsheets, PDFs, and text files
    const url = new URL('https://www.googleapis.com/drive/v3/files');
    url.searchParams.set(
      'q',
      "trashed = false and (mimeType = 'application/vnd.google-apps.document' or mimeType = 'application/vnd.google-apps.presentation' or mimeType = 'application/vnd.google-apps.spreadsheet' or mimeType = 'application/pdf' or mimeType = 'text/plain' or mimeType = 'text/markdown')"
    );
    url.searchParams.set('fields', 'files(id, name, mimeType, modifiedTime, webViewLink, thumbnailLink, iconLink, size)');
    url.searchParams.set('orderBy', 'modifiedTime desc');
    url.searchParams.set('pageSize', '40');

    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      console.warn('Drive search error response:', errJson);
      throw new Error(errJson.error?.message || `Drive search failed with status ${res.status}`);
    }

    const data = await res.json();
    const allFiles: DriveTravelFile[] = data.files || [];

    // Prioritize files containing Italy/travel keywords in name
    const travelKeywords = ['이탈리아', 'italy', '여행', '일정', 'trip', 'travel', 'rome', '로마', '피렌체', 'florence', '베네치아', 'venice', '밀라노', 'milan', '유럽', 'europe', '휴가', '투어'];

    const sortedFiles = [...allFiles].sort((a, b) => {
      const aLower = a.name.toLowerCase();
      const bLower = b.name.toLowerCase();
      const aHasKw = travelKeywords.some((k) => aLower.includes(k));
      const bHasKw = travelKeywords.some((k) => bLower.includes(k));

      if (aHasKw && !bHasKw) return -1;
      if (!aHasKw && bHasKw) return 1;
      return new Date(b.modifiedTime).getTime() - new Date(a.modifiedTime).getTime();
    });

    return sortedFiles;
  } catch (error) {
    console.error('Failed to search Drive files:', error);
    throw error;
  }
}

/**
 * Reads the text content of a Google Document
 */
export async function readGoogleDoc(docId: string, accessToken: string): Promise<string> {
  const res = await fetch(`https://docs.googleapis.com/v1/documents/${docId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    // If Docs API scope is denied, fallback to Drive export
    return exportFileAsText(docId, accessToken);
  }

  const doc = await res.json();
  const textPieces: string[] = [];

  if (doc.title) {
    textPieces.push(`[문서 제목: ${doc.title}]\n\n`);
  }

  if (doc.body && Array.isArray(doc.body.content)) {
    for (const elem of doc.body.content) {
      if (elem.paragraph && Array.isArray(elem.paragraph.elements)) {
        for (const pe of elem.paragraph.elements) {
          if (pe.textRun && pe.textRun.content) {
            textPieces.push(pe.textRun.content);
          }
        }
      } else if (elem.table && Array.isArray(elem.table.tableRows)) {
        for (const row of elem.table.tableRows) {
          const rowTexts: string[] = [];
          if (Array.isArray(row.tableCells)) {
            for (const cell of row.tableCells) {
              if (Array.isArray(cell.content)) {
                for (const cElem of cell.content) {
                  if (cElem.paragraph && Array.isArray(cElem.paragraph.elements)) {
                    for (const pe of cElem.paragraph.elements) {
                      if (pe.textRun?.content) rowTexts.push(pe.textRun.content.trim());
                    }
                  }
                }
              }
            }
          }
          if (rowTexts.length > 0) {
            textPieces.push(`| ${rowTexts.join(' | ')} |\n`);
          }
        }
      }
    }
  }

  return textPieces.join('');
}

/**
 * Reads the text content of a Google Slides presentation
 */
export async function readGoogleSlides(presentationId: string, accessToken: string): Promise<string> {
  const res = await fetch(`https://slides.googleapis.com/v1/presentations/${presentationId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    return exportFileAsText(presentationId, accessToken);
  }

  const pres = await res.json();
  const textPieces: string[] = [];

  if (pres.title) {
    textPieces.push(`[슬라이드 제목: ${pres.title}]\n\n`);
  }

  if (Array.isArray(pres.slides)) {
    pres.slides.forEach((slide: any, index: number) => {
      textPieces.push(`\n[슬라이드 ${index + 1}]\n`);
      if (Array.isArray(slide.pageElements)) {
        for (const elem of slide.pageElements) {
          if (elem.shape?.text?.textElements) {
            for (const te of elem.shape.text.textElements) {
              if (te.textRun?.content) {
                textPieces.push(te.textRun.content);
              }
            }
          } else if (elem.table?.tableRows) {
            for (const row of elem.table.tableRows) {
              if (row.tableCells) {
                for (const cell of row.tableCells) {
                  if (cell.text?.textElements) {
                    for (const te of cell.text.textElements) {
                      if (te.textRun?.content) {
                        textPieces.push(te.textRun.content);
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });
  }

  return textPieces.join('');
}

/**
 * Generic export via Drive API as plain text or CSV
 */
export async function exportFileAsText(fileId: string, accessToken: string): Promise<string> {
  try {
    const res = await fetch(
      `https://www.googleapis.com/drive/v3/files/${fileId}/export?mimeType=text/plain`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    if (res.ok) {
      return await res.text();
    }
  } catch {
    // Try CSV for spreadsheets
  }

  try {
    const res = await fetch(
      `https://www.googleapis.com/drive/v3/files/${fileId}/export?mimeType=text/csv`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    if (res.ok) {
      return await res.text();
    }
  } catch {
    // Try direct download
  }

  const dlRes = await fetch(
    `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  if (dlRes.ok) {
    return await dlRes.text();
  }

  throw new Error('파일 텍스트 내용을 가져올 수 없습니다.');
}

/**
 * Fetches file content regardless of format
 */
export async function fetchFileContent(file: DriveTravelFile, accessToken: string): Promise<DriveFetchResult> {
  if (file.mimeType === 'application/vnd.google-apps.document') {
    const text = await readGoogleDoc(file.id, accessToken);
    return { file, rawText: text, sourceType: 'doc' };
  } else if (file.mimeType === 'application/vnd.google-apps.presentation') {
    const text = await readGoogleSlides(file.id, accessToken);
    return { file, rawText: text, sourceType: 'slides' };
  } else if (file.mimeType === 'application/vnd.google-apps.spreadsheet') {
    const text = await exportFileAsText(file.id, accessToken);
    return { file, rawText: text, sourceType: 'sheets' };
  } else {
    const text = await exportFileAsText(file.id, accessToken);
    return { file, rawText: text, sourceType: 'text' };
  }
}
