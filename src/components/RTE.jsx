import React, { useState, useRef, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { Controller } from 'react-hook-form';
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});

export default function RTE({ name, control, label, defaultValue = "" }) {
  const [aiSuggestion, setAiSuggestion] = useState("");
  const editorRef = useRef(null);
  const debounceTimeout = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const getNextWords = async (inputText) => {
    try {
      console.log("Making Groq API request...");
      const response = await groq.chat.completions.create({
        model: "llama3-8b-8192",
        messages: [
          { role: "system", content: "You are an AI assistant that predicts the next few words of a sentence and please only type the words in the output nothing else." },
          { role: "user", content: `Complete this sentence: "${inputText}"` }
        ],
        temperature: 0.7,
        max_tokens: 10,
        stream: false
      });

      const generatedText = response.choices?.[0]?.message?.content
        ?.replace(/['"]/g, '')
        ?.trim();
      
      setAiSuggestion(generatedText || "");
    } catch (err) {
      console.error("Groq API error:", err);
      setAiSuggestion("");
    }
  };

  const handleEditorChange = (content, editor) => {
    if (editorRef.current) {
      clearTimeout(debounceTimeout.current);
      debounceTimeout.current = setTimeout(() => {
        const text = editorRef.current.getContent({ format: "text" }).trim();
        if (text.length > 5) {
          getNextWords(text);
        }
      }, 500);
    }
  };

  // Function to insert suggestion
  const insertSuggestion = (editor) => {
    if (!aiSuggestion) return;
    
    // Store current selection
    const currentPos = editor.selection.getBookmark();
    
    // Clean the suggestion text
    const cleanedSuggestion = aiSuggestion
      .replace(/['"]/g, '')
      .trim();
    
    // Insert content with proper spacing
    const currentContent = editor.getContent();
    const endsWithSpace = currentContent.endsWith(' ') || currentContent.endsWith('&nbsp;');
    const textToInsert = endsWithSpace ? cleanedSuggestion : ` ${cleanedSuggestion}`;
    
    editor.execCommand('mceInsertContent', false, textToInsert);
    
    // Move cursor to end
    editor.selection.moveToBookmark(currentPos);
    editor.selection.collapse(false);
    
    // Clear suggestion
    setAiSuggestion("");
    
    // Ensure editor keeps focus
    requestAnimationFrame(() => {
      editor.focus();
      editor.nodeChanged();
    });
  };

  // Handle tab key for desktop
  const handleTabPress = (editor, e) => {
    if (e.key === 'Tab' && aiSuggestion) {
      e.preventDefault();
      e.stopPropagation();
      insertSuggestion(editor);
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.off('keydown');
      editorRef.current.on('keydown', (e) => handleTabPress(editorRef.current, e));
    }
  }, [aiSuggestion]);

  return (
    <div className='w-full mb-6'>
      {label && <label className='block mb-2 text-lg font-semibold text-gray-800'>{label}</label>}

      <Controller
        name={name || "content"}
        control={control}
        render={({ field: { onChange } }) => (
          <div className="relative">
            <Editor
              apiKey="mknsailavtgfy63zr5cdjr3rfsafz5q6xfw83expu79ei7yo"
              onInit={(evt, editor) => {
                editorRef.current = editor;
                editor.on('keydown', (e) => handleTabPress(editor, e));
              }}
              initialValue={defaultValue}
              init={{
                height: isMobile ? 300 : 500, // Shorter height on mobile
                menubar: !isMobile, // Hide menubar on mobile
                plugins: [
                  "advlist", "autolink", "lists", "link", "charmap", "preview",
                  "anchor", "searchreplace", "visualblocks", "code", "fullscreen",
                  "insertdatetime", "media", "table", "help", "wordcount"
                ],
                toolbar: isMobile 
                  ? "bold italic | bullist numlist | undo redo" // Simplified toolbar for mobile
                  : "undo redo | blocks | bold italic forecolor | alignleft aligncenter alignright | bullist numlist outdent indent | removeformat | help",
                content_style: "body { font-family: Helvetica, Arial, sans-serif; font-size: 16px; background-color: #f9f9f9; color: #333; }",
                toolbar_sticky: true,
                branding: false,
                browser_spellcheck: true,
                tab_focus: false,
                entity_encoding: 'raw',
                forced_root_block: 'p',
                custom_shortcuts: false,
                keep_styles: true,
                remove_trailing_brs: false,
                mobile: {
                  menubar: false,
                  toolbar_sticky: true,
                  toolbar_location: 'bottom',
                  toolbar_mode: 'floating'
                }
              }}
              onEditorChange={(content, editor) => {
                onChange(content);
                handleEditorChange(content, editor);
              }}
            />

            {aiSuggestion && (
              <div className="mt-2">
                {isMobile ? (
                  // Mobile suggestion UI
                  <button
                    onClick={() => editorRef.current && insertSuggestion(editorRef.current)}
                    className="w-full py-2 px-4 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600 active:bg-blue-700 transition-colors"
                  >
                    Tap to insert: <span className="italic">{aiSuggestion}</span>
                  </button>
                ) : (
                  // Desktop suggestion UI
                  <p className="text-gray-400">
                    Suggested: <span className="italic">{aiSuggestion}</span> (Press Tab to accept)
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      />
    </div>
  );
}