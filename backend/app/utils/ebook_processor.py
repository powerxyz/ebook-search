import os
import re
import logging
from pathlib import Path
import PyPDF2
import ebooklib
from ebooklib import epub
from pdfminer.high_level import extract_text as pdfminer_extract_text

logger = logging.getLogger(__name__)

class EbookProcessor:
    """Utility class for processing ebooks."""
    
    @staticmethod
    def get_metadata_from_file(file_path):
        """Extract metadata from an ebook file."""
        file_ext = Path(file_path).suffix.lower().lstrip('.')
        file_size = os.path.getsize(file_path)
        
        metadata = {
            'file_path': file_path,
            'file_format': file_ext,
            'file_size': file_size,
            'title': Path(file_path).stem,  # Default to filename if no title found
            'author': None
        }
        
        try:
            if file_ext == 'pdf':
                pdf_metadata = EbookProcessor._extract_pdf_metadata(file_path)
                metadata.update(pdf_metadata)
            elif file_ext == 'epub':
                epub_metadata = EbookProcessor._extract_epub_metadata(file_path)
                metadata.update(epub_metadata)
            # Add support for azw3 if needed
        except Exception as e:
            logger.error(f"Error extracting metadata from {file_path}: {str(e)}")
        
        return metadata
    
    @staticmethod
    def extract_text_from_file(file_path):
        """Extract text content from an ebook file."""
        file_ext = Path(file_path).suffix.lower().lstrip('.')
        
        try:
            if file_ext == 'pdf':
                return EbookProcessor._extract_text_from_pdf(file_path)
            elif file_ext == 'epub':
                return EbookProcessor._extract_text_from_epub(file_path)
            # Add support for azw3 if needed
        except Exception as e:
            logger.error(f"Error extracting text from {file_path}: {str(e)}")
            return ""
    
    @staticmethod
    def _extract_pdf_metadata(file_path):
        """Extract metadata from a PDF file."""
        metadata = {}
        
        try:
            with open(file_path, 'rb') as file:
                reader = PyPDF2.PdfReader(file)
                info = reader.metadata
                
                if info:
                    if info.title:
                        metadata['title'] = info.title
                    if info.author:
                        metadata['author'] = info.author
        except Exception as e:
            logger.error(f"Error extracting PDF metadata from {file_path}: {str(e)}")
        
        return metadata
    
    @staticmethod
    def _extract_epub_metadata(file_path):
        """Extract metadata from an EPUB file."""
        metadata = {}
        
        try:
            book = epub.read_epub(file_path)
            
            # Get title
            title = book.get_metadata('DC', 'title')
            if title:
                metadata['title'] = title[0][0]
            
            # Get author
            creator = book.get_metadata('DC', 'creator')
            if creator:
                metadata['author'] = creator[0][0]
        except Exception as e:
            logger.error(f"Error extracting EPUB metadata from {file_path}: {str(e)}")
        
        return metadata
    
    @staticmethod
    def _extract_text_from_pdf(file_path):
        """Extract text content from a PDF file."""
        try:
            # Using pdfminer for better text extraction
            text = pdfminer_extract_text(file_path)
            return text
        except Exception as e:
            logger.error(f"Error extracting text from PDF {file_path}: {str(e)}")
            
            # Fallback to PyPDF2 if pdfminer fails
            try:
                text = ""
                with open(file_path, 'rb') as file:
                    reader = PyPDF2.PdfReader(file)
                    for page_num in range(len(reader.pages)):
                        text += reader.pages[page_num].extract_text() + "\n"
                return text
            except Exception as e2:
                logger.error(f"Fallback extraction failed for PDF {file_path}: {str(e2)}")
                return ""
    
    @staticmethod
    def _extract_text_from_epub(file_path):
        """Extract text content from an EPUB file."""
        try:
            book = epub.read_epub(file_path)
            text = ""
            
            for item in book.get_items():
                if item.get_type() == ebooklib.ITEM_DOCUMENT:
                    content = item.get_content().decode('utf-8')
                    # Remove HTML tags
                    text += re.sub('<[^<]+?>', ' ', content) + "\n"
            
            return text
        except Exception as e:
            logger.error(f"Error extracting text from EPUB {file_path}: {str(e)}")
            return "" 