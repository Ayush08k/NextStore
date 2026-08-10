import React, { useState, useEffect, useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { BookOpen, CheckCircle, ShoppingCart, Award, Sparkles, Compass } from 'lucide-react';
import SkeletonLoader from '../components/SkeletonLoader';

export const BooksPage = () => {
  const { addToCart } = useContext(ShopContext);
  const [cities, setCities] = useState([]);
  const [schools, setSchools] = useState([]);
  const [books, setBooks] = useState([]);

  const [selectedCity, setSelectedCity] = useState('');
  const [selectedSchoolId, setSelectedSchoolId] = useState('');
  const [selectedClass, setSelectedClass] = useState('Class 10');
  const [selectedBoard, setSelectedBoard] = useState('CBSE');
  const [loading, setLoading] = useState(false);
  const [kitAddedMsg, setKitAddedMsg] = useState('');

  // Popular CBSE Reference Books
  const popularCbseReferenceBooks = [
    {
      id: 'cbse-ref-1',
      subject: 'Mathematics',
      title: 'Mathematics for Class 10 by R.D. Sharma',
      publisher: 'Dhanpat Rai Publications',
      price: 725,
      range: '₹650 – ₹800',
      description: 'Comprehensive Board Exam & Foundation Guide with exemplar solved problems.'
    },
    {
      id: 'cbse-ref-2',
      subject: 'Mathematics',
      title: 'Secondary School Mathematics by R.S. Aggarwal',
      publisher: 'Bharati Bhawan',
      price: 595,
      range: '₹550 – ₹650',
      description: 'Step-by-step mathematical theory and practice exercises for boards.'
    },
    {
      id: 'cbse-ref-3',
      subject: 'Science',
      title: 'Physics / Chemistry / Biology by Lakhmir Singh & Manjit Kaur (3-Book Set)',
      publisher: 'S. Chand Publishing',
      price: 1195,
      range: '₹1,100 – ₹1,300',
      description: 'Complete 3-volume conceptual science reference set for Class 10.'
    },
    {
      id: 'cbse-ref-4',
      subject: 'Science',
      title: 'All in One Science Class 10 (Arihant)',
      publisher: 'Arihant Experts',
      price: 495,
      range: '₹450 – ₹550',
      description: 'All-inclusive theory, NCERT textbook solutions & sample board papers.'
    },
    {
      id: 'cbse-ref-5',
      subject: 'Social Science',
      title: 'All in One Social Science Class 10 (Arihant)',
      publisher: 'Arihant Experts',
      price: 495,
      range: '₹450 – ₹550',
      description: 'History, Civics, Geography & Economics structured board review.'
    },
    {
      id: 'cbse-ref-6',
      subject: 'English',
      title: 'All in One English Language & Literature Class 10 (Arihant)',
      publisher: 'Arihant Experts',
      price: 450,
      range: '₹400 – ₹500',
      description: 'Grammar, reading comprehension, writing skills & chapter summaries.'
    },
    {
      id: 'cbse-ref-7',
      subject: 'Question Banks',
      title: 'Oswaal / Educart / Xam Idea Question Banks (Per Subject)',
      publisher: 'Oswaal / Educart / Xam Idea',
      price: 425,
      range: '₹350 – ₹500 each',
      description: 'Solved previous 10-year board papers & mock practice question sets.'
    }
  ];

  // Popular RBSE Reference Books & Passbooks
  const popularRbseReferenceBooks = [
    {
      id: 'rbse-ref-1',
      subject: 'All Subjects Set',
      title: 'Sanjiv Passbook Complete Set (संजीव पासबुक - ऑल 6 सब्जेक्ट्स)',
      publisher: 'Sanjiv Prakashan Jaipur',
      price: 1100,
      range: '₹1,000 – ₹1,200',
      description: 'Complete 6-subject comprehensive passbook set (Hindi & English Medium).'
    },
    {
      id: 'rbse-ref-2',
      subject: 'Model Papers',
      title: 'Sanjiv Desk Work & Model Papers (संजीव डेस्क वर्क)',
      publisher: 'Sanjiv Prakashan Jaipur',
      price: 75,
      range: '₹60 – ₹90 per book',
      description: 'Subjectwise RBSE board pattern desk work model practice papers.'
    },
    {
      id: 'rbse-ref-3',
      subject: 'Refresher Set',
      title: 'Excellent Passbook / Refresher Complete Set (एक्सीलेंट पासबुक)',
      publisher: 'Student Aids Publications',
      price: 1050,
      range: '₹1,000 – ₹1,100',
      description: 'Complete 6-subject RBSE refresher passbooks with solved exercises.'
    },
    {
      id: 'rbse-ref-4',
      subject: 'Question Bank',
      title: 'Oswaal / Arihant RBSE Board Question Bank (Per Subject)',
      publisher: 'Oswaal / Arihant',
      price: 325,
      range: '₹250 – ₹400 per book',
      description: 'RBSE chapterwise solved previous years question bank.'
    }
  ];

  // Popular ICSE Reference Books & Question Banks (STAIRS SCHOOL OF EXCELLENCE)
  const popularIcseReferenceBooks = [
    {
      id: 'icse-ref-1',
      subject: '10 Years Solved Papers',
      title: '10 Years Solved Papers – ICSE Class 10 (Gurukul / Oswaal / Evergreen)',
      publisher: 'Gurukul / Oswaal / Evergreen',
      price: 900,
      range: '₹800 – ₹1,000',
      description: 'Complete 10-year board solved papers for all ICSE Class 10 subjects.'
    },
    {
      id: 'icse-ref-2',
      subject: 'Question Banks',
      title: 'Subject Question Banks – ICSE Class 10 (Oswaal / Educart / Most Likely)',
      publisher: 'Oswaal / Educart / Most Likely',
      price: 425,
      range: '₹350 – ₹500 each',
      description: 'Chapterwise ICSE question banks with MCQs, structured, and analytical questions.'
    },
    {
      id: 'icse-ref-3',
      subject: 'Mathematics',
      title: 'Concise Mathematics Class 10 (Selina Publishers / R.K. Bansal)',
      publisher: 'Selina Publishers',
      price: 600,
      range: '₹580 – ₹620',
      description: 'Most popular ICSE Maths textbook with detailed worked solutions.'
    },
    {
      id: 'icse-ref-4',
      subject: 'Mathematics',
      title: 'Understanding ICSE Mathematics Class 10 (M.L. Aggarwal / Avichal)',
      publisher: 'Avichal Publishing',
      price: 575,
      range: '₹550 – ₹600',
      description: 'Comprehensive ICSE Maths with concept-based explanations and practice sets.'
    },
    {
      id: 'icse-ref-5',
      subject: 'Chemistry',
      title: 'Simplified ICSE Chemistry (Dr. Viraf J. Dalal / Allied Publishers)',
      publisher: 'Allied Publishers',
      price: 500,
      range: '₹480 – ₹520',
      description: 'Popular ICSE Chemistry reference with detailed theory and board-pattern questions.'
    },
    {
      id: 'icse-ref-6',
      subject: 'English Literature',
      title: 'Treasure Chest: A Collection of ICSE Poems & Short Stories',
      publisher: 'Evergreen / Morning Star',
      price: 320,
      range: '₹290 – ₹350',
      description: 'Official ICSE English Literature text with study notes and model answers.'
    },
    {
      id: 'icse-ref-7',
      subject: 'Computer Applications',
      title: 'Understanding ICSE Computer Applications with BlueJ (APC / Vijay Kumar Pandey)',
      publisher: 'APC Books',
      price: 550,
      range: '₹520 – ₹580',
      description: 'ICSE Computer Applications with Java BlueJ programming concepts and lab work.'
    }
  ];

  // Fetch Cities on load
  useEffect(() => {
    fetch('/api/schools/cities')
      .then((res) => res.json())
      .then((data) => {
        setCities(data);
        if (data.length > 0) setSelectedCity(data[0]);
      });
  }, []);

  // Fetch Schools when City changes
  useEffect(() => {
    if (selectedCity) {
      fetch(`/api/schools?city=${encodeURIComponent(selectedCity)}`)
        .then((res) => res.json())
        .then((data) => {
          setSchools(data);
          if (data.length > 0) setSelectedSchoolId(data[0].id);
        });
    }
  }, [selectedCity]);

  // Fetch Books when School, Class, or Board changes
  useEffect(() => {
    if (selectedSchoolId && selectedClass) {
      setLoading(true);
      fetch(`/api/books?school_id=${selectedSchoolId}&class_grade=${encodeURIComponent(selectedClass)}&board=${selectedBoard}`)
        .then((res) => res.json())
        .then((data) => {
          setBooks(data);
          setLoading(false);
        });
    }
  }, [selectedSchoolId, selectedClass, selectedBoard]);

  // Helper: return the boards a given school offers
  const getSchoolBoards = (school) => {
    if (!school) return ['CBSE'];
    const n = school.name.toLowerCase();
    if (n.includes('stairs')) return ['ICSE'];
    if (n.includes('asian') || n.includes('new model')) return ['RBSE'];
    if (n.includes('palace')) return ['CBSE', 'RBSE'];
    return ['CBSE'];
  };

  const selectedSchoolObj = schools.find((s) => s.id === parseInt(selectedSchoolId));
  const availableBoards = getSchoolBoards(selectedSchoolObj);

  // Auto-select the correct board whenever school changes
  useEffect(() => {
    const boards = getSchoolBoards(selectedSchoolObj);
    if (!boards.includes(selectedBoard)) {
      setSelectedBoard(boards[0]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSchoolId, schools]);

  const handleAddFullKit = () => {
    if (books.length === 0) return;
    const totalKitPrice = books.reduce((sum, b) => sum + b.price, 0);
    const selectedSchoolObj = schools.find((s) => s.id === parseInt(selectedSchoolId));

    const kitItem = {
      id: `kit-${selectedSchoolId}-${selectedClass}-${selectedBoard}`,
      name: `${selectedSchoolObj ? selectedSchoolObj.name : 'School'} - Complete ${selectedClass} (${selectedBoard} Board) Book Kit`,
      category: 'School Books',
      price: totalKitPrice,
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&q=80',
    };

    addToCart(kitItem);
    setKitAddedMsg(`Complete ${selectedBoard} Class Book Kit added to your cart!`);
    setTimeout(() => setKitAddedMsg(''), 4000);
  };

  const handleAddBook = (book) => {
    addToCart({
      id: `book-${book.id}`,
      name: book.book_title || book.title,
      category: 'School Books',
      price: book.price,
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&q=80'
    });
    setKitAddedMsg(`"${book.book_title || book.title}" added to your cart!`);
    setTimeout(() => setKitAddedMsg(''), 4000);
  };


  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <div className="section-header">
        <div>
          <h1 className="section-title">School & Class Books Selector</h1>
          <p style={{ color: '#6b7280', marginTop: '4px' }}>
            Select your City, School Name, Class Grade, and Board Affiliation (CBSE / RBSE) to load prescribed textbooks.
          </p>
        </div>
      </div>

      {/* Cascade Filters */}
      <div className="form-card" style={{ marginBottom: '30px', background: '#f8f8f4' }}>
        <div className="grid-3">
          <div className="form-group">
            <label className="form-label">1. Select City</label>
            <select
              className="form-control"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
            >
              {cities.map((city, idx) => (
                <option key={idx} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">2. Select School Name</label>
            <select
              className="form-control"
              value={selectedSchoolId}
              onChange={(e) => setSelectedSchoolId(e.target.value)}
            >
              {schools.map((school) => (
                <option key={school.id} value={school.id}>
                  {school.name} ({school.city})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">3. Select Class / Grade</label>
            <select
              className="form-control"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              {['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'].map(
                (cls, idx) => (
                  <option key={idx} value={cls}>
                    {cls}
                  </option>
                )
              )}
            </select>
          </div>
        </div>

        {/* Board Selection Tab Bar — shows ONLY the boards available for the selected school */}
        <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#374151', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Compass size={18} color="#6c804b" /> Board Affiliation:
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {availableBoards.map((board) => (
              <button
                key={board}
                className={selectedBoard === board ? 'btn-primary-green' : 'btn-outline-grey'}
                style={{ borderRadius: '20px', padding: '8px 20px', fontSize: '13px' }}
                onClick={() => setSelectedBoard(board)}
              >
                {board === 'CBSE' ? 'CBSE Board' : board === 'RBSE' ? 'RBSE Board (राजस्थान बोर्ड)' : 'ICSE Board'}
              </button>
            ))}
          </div>
          {availableBoards.length > 1 && (
            <span style={{ fontSize: '12px', background: '#fef3c7', color: '#92400e', padding: '4px 10px', borderRadius: '12px', fontWeight: 700 }}>
              ✨ {selectedSchoolObj?.name} offers both CBSE & RBSE Curriculum
            </span>
          )}
          {availableBoards.includes('ICSE') && (
            <span style={{ fontSize: '12px', background: '#e0f2fe', color: '#075985', padding: '4px 10px', borderRadius: '12px', fontWeight: 700 }}>
              📘 STAIRS School of Excellence — ICSE Board
            </span>
          )}
        </div>
      </div>

      {/* Success Notification */}
      {kitAddedMsg && (
        <div style={{ background: '#eef2e6', color: '#586a3b', padding: '14px 20px', borderRadius: '8px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <CheckCircle size={20} />
          <span style={{ fontWeight: 600 }}>{kitAddedMsg}</span>
        </div>
      )}

      {/* Official Prescribed Books Display */}
      {loading ? (
        <SkeletonLoader type="list" count={4} />
      ) : books.length > 0 ? (
        <div style={{ marginBottom: '50px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ fontSize: '20px' }}>
                Official {selectedBoard} Textbooks for {selectedSchoolObj ? selectedSchoolObj.name : ''} - {selectedClass}
              </h2>
              <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '2px' }}>
                Complete {selectedBoard} board syllabus prescribed textbooks set for {selectedClass}.
              </p>
            </div>
            <button className="btn-primary-green" onClick={handleAddFullKit}>
              <ShoppingCart size={18} /> Buy Complete {selectedBoard} Book Kit (₹{books.reduce((s, b) => s + b.price, 0).toFixed(2)})
            </button>
          </div>

          <div className="grid-2" style={{ gap: '20px' }}>
            {books.map((book) => (
              <div
                key={book.id}
                style={{
                  background: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '14px',
                  padding: '20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{ background: '#f0f4ea', padding: '14px', borderRadius: '12px', color: '#6c804b' }}>
                    <BookOpen size={24} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span style={{ fontSize: '11px', background: '#f3f4f6', color: '#4b5563', padding: '2px 8px', borderRadius: '8px', fontWeight: 700, textTransform: 'uppercase' }}>
                        {book.subject}
                      </span>
                      <span style={{ fontSize: '11px', background: '#eef2e6', color: '#586a3b', padding: '2px 8px', borderRadius: '8px', fontWeight: 700 }}>
                        {book.board || selectedBoard}
                      </span>
                    </div>
                    <h3 style={{ fontSize: '15.5px', fontWeight: 700, marginTop: '6px' }}>{book.book_title}</h3>
                    <p style={{ fontSize: '12.5px', color: '#6b7280', marginTop: '2px' }}>
                      Publisher: {book.publisher}
                    </p>

                    {book.price_range && (
                      <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>
                        Approx. Range: {book.price_range}
                      </div>
                    )}

                    <p style={{ fontSize: '16px', fontWeight: 800, color: '#22252a', marginTop: '4px' }}>
                      ₹{parseFloat(book.price).toFixed(2)}
                    </p>
                  </div>
                </div>

                <button
                  className="btn-outline-grey"
                  style={{ padding: '8px 14px', fontSize: '13px' }}
                  onClick={() => handleAddBook(book)}
                >
                  + Add Book
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="form-card" style={{ textAlign: 'center', padding: '40px', color: '#6b7280', marginBottom: '40px' }}>
          <BookOpen size={48} color="#d1d5db" style={{ marginBottom: '12px' }} />
          <p>No prescribed {selectedBoard} booklist found for the selected school and class.</p>
          <button
            className="btn-outline-grey"
            style={{ marginTop: '14px', fontSize: '13px' }}
            onClick={() => setSelectedBoard(selectedBoard === 'CBSE' ? 'RBSE' : 'CBSE')}
          >
            Switch to {selectedBoard === 'CBSE' ? 'RBSE Board' : 'CBSE Board'}
          </button>
        </div>
      )}

      {/* POPULAR REFERENCE BOOKS SECTION (CBSE & RBSE TABS) */}
      <div style={{ marginTop: '50px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <Award size={26} color="#6c804b" />
          <h2 style={{ fontSize: '22px', fontWeight: 800 }}>
            Popular {selectedBoard} Reference Books, Passbooks & Model Papers
          </h2>
        </div>
        <p style={{ color: '#6b7280', marginBottom: '24px', fontSize: '14px' }}>
          {selectedBoard === 'RBSE'
            ? 'State-specific RBSE Sanjiv Passbooks, Desk Work model papers, and refresher guides for Rajasthan Board exams:'
            : selectedBoard === 'ICSE'
            ? 'Popular Selina Concise textbooks, 10-year solved papers, and ICSE question banks for STAIRS School of Excellence students:'
            : 'If you are preparing for board exams or competitive foundations (NTSE / Olympiads), pair your NCERTs with these top reference materials:'}
        </p>

        <div className="grid-2" style={{ gap: '20px' }}>
          {(selectedBoard === 'RBSE' ? popularRbseReferenceBooks : selectedBoard === 'ICSE' ? popularIcseReferenceBooks : popularCbseReferenceBooks).map((refBook) => (
            <div
              key={refBook.id}
              style={{
                background: '#ffffff',
                border: '1.5px solid #e7ebe1',
                borderRadius: '16px',
                padding: '22px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.02)'
              }}
            >
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flex: 1, paddingRight: '12px' }}>
                <div style={{ background: '#eef2e6', padding: '16px', borderRadius: '12px', color: '#586a3b' }}>
                  <Sparkles size={24} />
                </div>
                <div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', background: '#eef2e6', color: '#586a3b', padding: '2px 8px', borderRadius: '8px', fontWeight: 700 }}>
                      {refBook.subject}
                    </span>
                    <span style={{ fontSize: '11px', color: '#6b7280', fontWeight: 600 }}>
                      {refBook.publisher}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '16px', fontWeight: 700, marginTop: '6px', color: '#1a1c1e' }}>{refBook.title}</h3>
                  <p style={{ fontSize: '12.5px', color: '#6b7280', margin: '4px 0' }}>{refBook.description}</p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px' }}>
                    <span style={{ fontSize: '17px', fontWeight: 800, color: '#2b381c' }}>₹{refBook.price.toFixed(2)}</span>
                    <span style={{ fontSize: '12px', color: '#9ca3af' }}>Range: {refBook.range}</span>
                  </div>
                </div>
              </div>

              <button
                className="btn-primary-green"
                style={{ padding: '9px 16px', fontSize: '13px', whiteSpace: 'nowrap' }}
                onClick={() => handleAddBook(refBook)}
              >
                + Add Reference Book
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
