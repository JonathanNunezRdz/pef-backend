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

    filename = '/home/jonas/Desktop/code/pef/pef-backend/tmp/test.txt'

    try:
        data = open(filename)
        text = ''.join([line.replace("\n", "") for line in data])
        data.close()
    except FileNotFoundError:
        print('File:', filename, 'not found')
        sys.exit(2)
    
    text = '''Tengo 23 años viviendo en casa pequeña pero moderna en el centro de la ciudad. Mi casa tiene dos habitaciones, un baño, una sala de estar, una cocina y una pequeña terraza. Por las tardes el sol calienta la casa durante horas, así que no suele hacer frío.'''

    text = legibilidad.numbers_to_words(text)

    avg_letters_per_word, var_letters_per_word = legibilidad.calculate_avg_var_letters_per_word(text)
    if avg_letters_per_word is None or var_letters_per_word is None:
        avg_letters_per_word, var_letters_per_word = 0, 0

    metrics = {
        'numOfLetters': legibilidad.count_letters(text),
        'numOfSyllables': legibilidad.count_all_syllables(text),
        'numOfWords': legibilidad.count_words(text),
        'numOfSentences': legibilidad.count_sentences(text),
        'avgLettersPerWord': avg_letters_per_word,
        'avgSyllablePerWord': legibilidad.calculate_avg_syllables_per_word(text),
        'avgWordsPerSentence': legibilidad.calculate_avg_words_per_sentence(text),
        'avgSentencesPerHundredWords': legibilidad.calculate_avg_sentences_per_hundred_words(text),
        'avgSyllablesPerHundredWords': legibilidad.calculate_avg_syllables_per_hundred_words(text),
        'varLettersPerWord': var_letters_per_word
    }

    print(dumps(metrics))
    sys.stdout.flush()

if __name__ == '__main__':
    main()