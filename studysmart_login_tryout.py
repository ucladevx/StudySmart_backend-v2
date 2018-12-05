import pymongo
import pprint
#create a database in mongodb 
# myclient = pymongo.MongoClient("mongodb://localhost:27017/")
# mydb = myclient["mydatabase"]
# #create a collection 
# mycol = mydb["studentInfo"]
# students = [{"email_ucla":"ziqing@ucla.edu","name":"Aurora Jiang"},
#  {"email_ucla":"ab@ucla.edu","name":"ab"},
#  {"email_ucla":"ann@ucla.edu","name":"Ann"},
#  {"email_ucla":"hello@ucla.edu","name":"Hi"},
#  {"email_ucla":"sh@ucla.edu","name":"SH"},
#  {"email_ucla":"tr@ucla.edu","name":"tr"}]

#add documents into the collection 
#x = mycol.insert_many(students)
#test_print
# dblist = myclient.list_database_names()
# if "mydatabase" in dblist:
# 	print("The database exists.")

# #test_print_out 
# pprint.pprint(mycol.find({"email_ucla": "ziqing@ucla.edu"}).count())

#connect to database



def connect_to_db():
	myclient = pymongo.MongoClient("mongodb://localhost:27017/")
	mydb = myclient["mydatabase"]
	mycol = mydb["studentInfo"]
	return mycol

def find_one_user(email_ID=""):
	mycol=connect_to_db()
	cur=mycol.find({"email_ucla":str(email_ID)})
	num_user=cur.count()
	if num_user==0:
		print("No user exists")
		return None
	elif num_user==1:
		print(cur[0]["name"]+" found")
		return cur[0]
	else:
		print("Error!! Should not have multiple users of the same email_ID")
		return None
def insert(email_ID="",name=""):
	mycol=connect_to_db()
	if find_one_user(email_ID=email_ID) is not None:
		print("User already exists")
		return
	new_user_document = {"email_ucla":email_ID,"name":name}
	x = mycol.insert_one(new_user_document)
	print(name + " inserted")




students = [{"email_ucla":"ziqing@ucla.edu","name":"Aurora Jiang"},
 {"email_ucla":"ab@ucla.edu","name":"ab"},
 {"email_ucla":"ann@ucla.edu","name":"Ann"},
 {"email_ucla":"hello@ucla.edu","name":"Hi"},
 {"email_ucla":"sh@ucla.edu","name":"SH"},
 {"email_ucla":"tr@ucla.edu","name":"tr"}]

for student in students:
	insert(student["email_ucla"],student["name"])
insert("mh@ucla.edu","mh")
print(find_one_user("mh@ucla.edu"))
print(find_one_user("h@ucla.edu"))
# #find user based on email ID
# #used when a new user login to StudySmart
# #if found
# #return user info in a jsonified object
# #and display relative pages
# #if not found 
# #display sign up page , collect user info and call insert 
 # def find(email_ID=""):
 # 	myclient = pymongo.MongoClient("mongodb://localhost:27017/")
 # 	mydb = myclient["mydatabase"]
 # 	mycol = mydb["studentInfo"]





# #insert a user's info into database
# def insert();

# #return all the users
# def find_all();

# #optional 
# #delete a user's profile 
# def delete();




