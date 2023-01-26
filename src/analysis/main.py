"""
    1 from sysargs get what function to run
    2 run function and print in json format
    3 flush stdout
"""
import getopt, sys
from json import dumps
import legibilidad

def main():
    argument_list = sys.argv[1:]
    options = 'f:'
    long_options = ['file=']
    filename = ''

    try:
        arguments, values = getopt.getopt(argument_list, options, long_options)

        for current_argument, current_value in arguments:
            if current_argument in ('-f', f'--{long_options[0].replace("=", "")}'):
                filename = current_value.strip()
    except getopt.error as err:
        print(str(err))
        sys.exit(2)

    try:
        data = open(filename)
        text = ''.join([line.replace("\n", "") for line in data])
        data.close()
    except FileNotFoundError:
        print('File:', filename, 'not found')
        sys.exit(2)
    
    # print(text)

    metrics = {
        'numOfLetters': legibilidad.count_letters(text),
        'numOfSyllables': legibilidad.count_all_syllables(text),
        'numOfWords': legibilidad.count_words(text),
        'numOfSentences': legibilidad.count_sentences(text),
        'avgLettersPerWord': 0,
        'avgSyllablePerWord': 0,
        'avgWordsPerSentence': 0,
        'avgSentencesPerHundredWords': 0,
        'avgSyllablesPerHundredWords': 0,
        'varLettersPerWord': 0
    }

    print(metrics)
    
    return None

if __name__ == '__main__':
    main()