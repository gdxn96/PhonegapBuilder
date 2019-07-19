import session
import sqltasks
"""
Allows for creation and joining of existing sessions,
logic too complicated so a handler is needed
"""


class SessionHandler:
	def __init__(self, players_online):
		"""
		Constructor
		"""
		self.players_online = players_online

		self.sessions = {}

	def create_session(self, player):
		"""
		allows the creation of a new session, however if a session of the same
		type already exists, and is looking for players, it will join that session
		"""
		game_mode = player.get_chosen_game_mode()
		topic = player.get_chosen_topic()
		session_exists = self.check_for_existing(topic, game_mode)

		if (session_exists):
			session_exists.add_player(player)
		else:
			new_session = session.Session(player, game_mode, topic)
			self.sessions[str(new_session)] = new_session

		self.update_available_sessions()

	def join_session_by_id(self, player, session_id):
		sessions = self.sessions
		print(session_id)

		if session_id in sessions:
			self.sessions[session_id].add_player(player)

		self.update_available_sessions()

	def check_for_empty_sessions(self):
		"""
		Handles when a player unexpectedly disconnects
		"""
		sessions = self.sessions

		# checks for any empty sessions, if there are, they get deleted
		for id, session in sessions.copy().items():
			if (len(session.players) == 0):
				del sessions[id]

		self.update_available_sessions()

	def check_for_existing(self, topic, game_mode):
		"""
		check if an open session exists matching these attributes before
		making a new session
		"""
		for key, session in self.sessions.items():
			if session.matches_attributes(topic, game_mode):
				return session
		return False

	def update_available_sessions(self):
		"""
		update the sessions each player can join, (governed by chosen_topic)
		"""
		open_sessions_by_topic = {}

		# make a list of sessions for each topic inside open_sessions_by_topic
		topics = sqltasks.get_all_topics()
		for topic in topics:
			open_sessions_by_topic[topic["id"]] = []

		# for every open session, append that session to the list corresponding to its topic
		for key, session in self.sessions.items():
			if session.is_full == False:
				open_sessions_by_topic[session.topic].append(session.get_data())


		# update each players sessions
		for client, player in self.players_online.items():
			player_topic = player.get_chosen_topic()
			if player_topic != "":
				player.update_available_sessions(open_sessions_by_topic[player_topic])
				# if a key error appears here, ensure client is sending back integer id's




