from collections import Counter
import re

from fastapi.testclient import TestClient

from backend.curriculum import SOURCE, parse_curriculum
from backend.main import app


def test_every_authored_activity_in_exact_order_and_course():
    courses, answers = parse_curriculum()
    source = SOURCE.read_text()
    expected = re.findall(r'^\d+\. \[((?:GP|HP|Q|C)\d+) — .*?\]\(#\w+\)', source, re.M)
    actual = [a['id'].upper() for c in courses for u in c['units'] for a in u['activities']]
    assert actual == expected
    assert [c['id'] for c in courses] == ['git', 'github']
    assert [c['activity_count'] for c in courses] == [77, 33]
    assert [len(c['units']) for c in courses] == [12, 9]
    assert sum(len(c['lessons']) for c in courses) == 49
    assert len(answers) == 36
    assert Counter(a['type'] for c in courses for u in c['units'] for a in u['activities']) == {'practice': 90, 'quiz': 12, 'checkpoint': 8}


def test_all_lesson_and_activity_links_resolve():
    courses, _ = parse_curriculum()
    ids = {a['id'] for c in courses for u in c['units'] for a in u['activities']}
    ids.update(key for c in courses for key in c['lessons'])
    authored_body = SOURCE.read_text().split('# Course: Git\n', 1)[1]
    assert set(re.findall(r'\]\(#([^)]*)\)', authored_body)) <= ids


def test_every_practical_section_and_lesson_is_preserved():
    courses, _ = parse_curriculum()
    source = SOURCE.read_text()
    for course in courses:
        for lesson in course['lessons'].values():
            assert lesson['body'] in source
        for unit in course['units']:
            for activity in unit['activities']:
                if activity['type'] != 'quiz':
                    titles = [s['title'] for s in activity['sections']]
                    assert 'Author answer / one acceptable approach' in titles
                    assert any('Completion criteria' in t for t in titles)
                    for section in activity['sections']:
                        assert section['body'] in source


def test_quiz_answers_hidden_until_check_and_scored_on_server():
    with TestClient(app) as client:
        response = client.get('/api/curriculum')
        assert response.status_code == 200
        quizzes = [a for c in response.json()['courses'] for u in c['units'] for a in u['activities'] if a['type'] == 'quiz']
        for quiz in quizzes:
            for question in quiz['questions']:
                assert set(question) == {'id', 'prompt', 'options'}
        result = client.post('/api/curriculum/git/quizzes/q01/check', json={'answers': {'Q01.1': 'C', 'Q01.2': 'C', 'Q01.3': 'D'}})
        assert result.status_code == 200
        assert result.json()['score'] == 3
        assert result.json()['passed']
        assert all(r['explanation'] and r['review'] for r in result.json()['results'])
        failed = client.post('/api/curriculum/git/quizzes/q01/check', json={'answers': {'Q01.1': 'A', 'Q01.2': 'A', 'Q01.3': 'A'}})
        assert not failed.json()['passed']
        assert client.post('/api/curriculum/git/quizzes/q01/check', json={'answers': {}}).status_code == 422
        assert client.post('/api/curriculum/github/quizzes/q01/check', json={'answers': {}}).status_code == 404
