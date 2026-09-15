"""Parse the authored curriculum once at startup; never execute its commands."""
from pathlib import Path
import re

SOURCE = Path(__file__).resolve().parents[1] / 'git-github-curriculum.md'


def parse_curriculum(path: Path = SOURCE):
    courses = []
    current_course = current_unit = record = None
    anchor = None
    fenced = False
    records = []
    for line in path.read_text(encoding='utf-8').splitlines():
        if line.startswith('```'):
            fenced = not fenced
        if not fenced:
            match = re.fullmatch(r'# Course: (Git|GitHub)', line)
            if match:
                current_course = {'id': match[1].lower(), 'title': match[1], 'units': [], 'lessons': {}}
                courses.append(current_course)
                record = None
                continue
            match = re.fullmatch(r'## (Git|GitHub) unit (\d+): (.+)', line)
            if match:
                current_unit = {'id': f'{current_course["id"]}-{match[2]}', 'number': int(match[2]), 'title': match[3], 'activities': []}
                current_course['units'].append(current_unit)
                record = None
                continue
            if line.startswith('## '):
                record = None
            match = re.fullmatch(r'<a id="([^"]+)"></a>', line)
            if match:
                anchor = match[1]
                record = None
                continue
            if line.startswith('### ') and current_course and current_unit:
                if not anchor:
                    raise ValueError(f'Missing content ID: {line}')
                record = {'id': anchor, 'heading': line[4:], 'lines': [], 'course': current_course, 'unit': current_unit}
                records.append(record)
                anchor = None
                continue
        if record is not None:
            record['lines'].append(line)

    answers = {}
    for item in records:
        body = '\n'.join(item['lines']).strip()
        course, unit = item['course'], item['unit']
        if item['heading'].startswith('Mini lesson: '):
            course['lessons'][item['id']] = {
                'id': item['id'], 'title': item['heading'].removeprefix('Mini lesson: '),
                'body': re.sub(r'^Content ID: `[^`]+`\s*', '', body),
            }
            continue
        kind = 'quiz' if item['id'].startswith('q') else 'checkpoint' if item['id'].startswith('c') else 'practice'
        title = item['heading'].split(' — ', 1)[1]
        activity = {'id': item['id'], 'title': title, 'type': kind}
        if kind == 'quiz':
            activity['questions'] = []
            parts = re.split(r'^#### (Q\d+\.\d+)\s*$', body, flags=re.M)
            for index in range(1, len(parts), 2):
                question_id, text = parts[index:index + 2]
                options = re.findall(r'^- \*\*([A-D])\.\*\* (.+)$', text, re.M)
                correct = re.search(r'\*\*Author answer:\*\* ([A-D])\.', text)
                explanation = re.search(r'\*\*Explanation:\*\* (.+?)(?=\n\n\*\*If missed|\Z)', text, re.S)
                review = re.search(r'\*\*If missed, review:\*\* (.+)', text)
                if len(options) != 4 or not correct or not explanation or not review:
                    raise ValueError(f'Malformed question: {question_id}')
                activity['questions'].append({'id': question_id, 'prompt': text.split('- **A.**')[0].strip(),
                                               'options': [{'id': key, 'text': value} for key, value in options]})
                answers[question_id] = {'correct': correct[1], 'explanation': explanation[1].strip(), 'review': review[1]}
            if len(activity['questions']) != 3:
                raise ValueError(f'Expected three questions in {item["id"]}')
        else:
            meta, _, body = body.partition('\n\n')
            activity['response'] = meta.split('Response: ', 1)[-1].split(' · Mini lesson:')[0] if 'Response: ' in meta else 'Practical checkpoint'
            lesson = re.search(r'Mini lesson: .*\(#([^)]+)\)', meta)
            activity['lesson_id'] = lesson[1] if lesson else None
            sections = re.split(r'^\*\*([^\n]+)\*\*\s*$', body, flags=re.M)
            activity['sections'] = [{'title': sections[i], 'body': sections[i+1].strip()} for i in range(1, len(sections), 2)]
            if not activity['sections'] or sections[0].strip():
                raise ValueError(f'Malformed activity sections: {item["id"]}')
        unit['activities'].append(activity)

    ids = set()
    for course in courses:
        for unit in course['units']:
            if not unit['activities']:
                raise ValueError(f'Empty unit: {unit["id"]}')
            for activity in unit['activities']:
                if activity['id'] in ids:
                    raise ValueError(f'Duplicate activity: {activity["id"]}')
                ids.add(activity['id'])
                if activity.get('lesson_id') and activity['lesson_id'] not in course['lessons']:
                    raise ValueError(f'Missing mini lesson for {activity["id"]}')
        course['activity_count'] = sum(len(unit['activities']) for unit in course['units'])
    if [course['id'] for course in courses] != ['git', 'github']:
        raise ValueError('Expected only Git and GitHub courses')
    return courses, answers
