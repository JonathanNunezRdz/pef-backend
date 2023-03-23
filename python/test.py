"""
    1 from sysargs get what function to run
    2 run function and print in json format
    3 flush stdout
"""
import separasilabas
import re

def count_syllables(word: str):
    '''
    Word syllable count
    '''
    word = re.sub(r'\W+', '', word)
    syllables = separasilabas.silabizer()
    return len(syllables(word))

def main():
    text = 'chiapas'
    text = ''.join(filter(lambda x: not x.isdigit(), text))
    clean = re.compile('\W+')
    text = clean.sub(' ', text).strip()
    text = text.split()
    text = filter(None, text)
    total = 0
    for word in text:
        total += count_syllables(word)
    if total == 0:
        print(1)
    else:
        print(total)

if __name__ == '__main__':
    main()


