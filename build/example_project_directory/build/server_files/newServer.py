from tornado import websocket, web, ioloop, httpserver
import tornado
import json
import sessionhandler, player
import sqltasks

def handle_message(client, message):
	"""
	any incoming messages from the client end up here, this method tells
	the message where to go, depending on the message "type" property
	"""
	# get player object associated with the client making the current request
	player = players_online[client]

	type = message["type"]
	data = message["data"]

	if (type == "choose_topic"):
		player.set_chosen_topic(data)
		session_handler.update_available_sessions()

	elif (type == "choose_game_mode"):
		player.set_chosen_game_mode(data)

	elif (type == "choose_session"):
		# do something involving joining a session by ID
		session_handler.join_session_by_id(player, data)

	elif (type == "create_session"):
		# create a session using the chosen topic and game_mode
		session_handler.create_session(player)

	elif (type == "leave_session"):
		player.leave_session()
		# if player was in session, sessions may need deleting
		session_handler.check_for_empty_sessions()

	elif (type == "answer_question"):
		player.answer_question(data)

	elif (type == "play_again"):
		player.session.replay(player)
		session_handler.update_available_sessions()


class WebSocketHandler(websocket.WebSocketHandler):
	def open(self):
		print("websocket opened")
		# put each new connected player into the collection of online players
		players_online[self] = player.Player(self, game_modes, hosting_options, topics)

	def check_origin(self, origin):
		return True;

	def on_message(self, message):

		# load the json msg
		message = json.loads(message)

		# send it for processing
		handle_message(self, message)

	def on_close(self):
		print("websocket closed")
		# get the player object
		player = players_online[self]

		player.leave_session()
		# check and remove player from collection of online players
		if self in players_online:
			del players_online[self]

		# if player was in session, sessions may need deleting
		session_handler.check_for_empty_sessions()

# get stuff from the database
topics = sqltasks.get_all_topics()
game_modes = sqltasks.get_all_modes()
hosting_options = sqltasks.get_all_hosting_options()

# initialize main script attributes
players_online = {} # collection used to store online players
session_handler = sessionhandler.SessionHandler(players_online)


app = tornado.web.Application([(r'/websocket', WebSocketHandler),])

if __name__ == '__main__':
	app.listen(443)
	tornado.ioloop.IOLoop.instance().start()