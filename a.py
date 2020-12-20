myList=[]
for i in range(8):
    myList.append(i+1)
myList.insert(4,13)
for i in range(3):
    myList.pop(i*2)
mySum=0
for i in range(len(myList)):
    mySum=mySum+myList[i]
print(mySum)

