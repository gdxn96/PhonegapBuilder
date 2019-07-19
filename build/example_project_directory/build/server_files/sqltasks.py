"""
All the methods in this module should incorporate mySQL, if they don't,
should/will
"""
import os
import json
from random import shuffle
import DBcm

config = {
            'host': '127.0.0.1',
            'database': 'mcqDB',
            'user': 'gdxn96',
            'password': 'wp12passwd'
        }


def is_answer_correct(answer_id):
    """
    checks the mySQL database to see if the param answer_id is correct
    """
    with DBcm.UseDatabase(config) as cursor:
        _SQL = """select answers.is_correct from answers where id = %s""" % answer_id

        cursor.execute(_SQL)
        data = cursor.fetchall()
    if data:
        return data[0]
    else:
        return False

def get_all_topics():
    """
    simply takes all topics from the database and places them into dicts
    """

    topics = []

    with DBcm.UseDatabase(config) as cursor:
        _SQL = """select * from topics"""

        cursor.execute(_SQL)
        data = cursor.fetchall()

    for element in data:
        topic = {}
        topic["id"] = element[0]
        topic["name"] = element[1]
        topics.append(topic)


    return topics

def get_all_modes():
    """
    simply reads all json files in the current directory, any with the type
    param of "gameMode" will be read in and stored in a list, this is needed
    for the user to choose which "gameMode" later
    """
    game_modes = []

    with DBcm.UseDatabase(config) as cursor:
        _SQL = """select * from game_modes"""

        cursor.execute(_SQL)
        data = cursor.fetchall()

    game_modes = []

    for row in data:
        game_mode = {}
        game_mode["id"] = row[0]
        game_mode["name"] = row[2]
        game_mode["max_players"] = row[3]
        game_mode["number_questions"] = row[4]
        game_mode["time"] = row[1]
        game_modes.append(game_mode)


    return game_modes

def get_all_hosting_options():
    """
    manually sets a list of hosting options for the client, they need to be
    persisted server-side and client-side so hard-coding them server-side
    prevents errors
    """
    options = []
    option = {"name": "Host a new Game", "id":"new_game"}
    options.append(option)
    option = {"name": "Join an open Game", "id":"join"}
    options.append(option)
    option = {"name": "Invite Friends to Online game", "id":"online"}
    options.append(option)
    option = {"name": "Invite Friends to Offline game", "id":"offline"}
    options.append(option)
    return options

def get_topic_name_by_id(id):
    """

    """

    options = get_all_topics()
    for option in options:
        if (option["id"] == id):
            return option["name"]
    return False

def get_game_mode_name_by_id(id):
    options = get_all_modes()
    for option in options:
        if (option["id"] == id):
            return option["name"]
    return False

def get_game_mode_by_id(id):
    """

    """

    options = get_all_modes()
    for option in options:
        if (option["id"] == id):
            return option
    return False

def get_answers_by_question_id(question_id):
    """

    """

    with DBcm.UseDatabase(config) as cursor:
        _SQL = """select answers.id, answers.answer from answers, questions_answers where answers.id = questions_answers.answer_id and questions_answers.question_id = %s""" % question_id
        cursor.execute(_SQL)
        data = cursor.fetchall()

    answers = []
    for row in data:
        answer = {
            "id": row[0],
            "answer" : row[1]
        }
        answers.append(answer)

    shuffle(answers)

    return answers

def get_questions_by_topic(topic_id, num_questions):
    """
    gets a list of questions and id's based on the param topic_id
    """

    print(topic_id)
    with DBcm.UseDatabase(config) as cursor:
        _SQL = ("""select * from questions, topics_questions where questions.id = topics_questions.question_id and
                topics_questions.topic_id = %s""" % topic_id)

        cursor.execute(_SQL)
        data = cursor.fetchall()

    questions = []
    for row in data:
        question = {
            "id" : row[0],
            "question" : row[1]
        }
        questions.append(question)

    shuffle(questions)
    return questions[:num_questions]